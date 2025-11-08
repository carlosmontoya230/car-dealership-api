import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MaintenanceEntity,
  MaintenanceStatus,
} from './entities/maintenance.entity';
import { VehicleEntity } from '../vehicle/entities/vehicle.entity';
import { UserEntity } from '../users/entities/users.entity';
import { AuthSsoService } from '../auth/dto/auth-sso.service';
import {
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
} from './dto/maintenanceController.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(MaintenanceEntity)
    private readonly maintenanceRepo: Repository<MaintenanceEntity>,
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepo: Repository<VehicleEntity>,
    private readonly authSsoService: AuthSsoService,
  ) {}

  async startMaintenance(dto: CreateMaintenanceDto, authorization: string) {
    const user = await this.authSsoService.getUserByToken(authorization);
    const isMechanic = user.rolUsers?.some(
      (rolUser: any) => rolUser.rol?.name === 'mechanic',
    );
    if (!isMechanic)
      throw new ForbiddenException('Only mechanics can start maintenance.');

    const vehicle = await this.vehicleRepo.findOne({
      where: { carPlate: dto.carPlate, isActive: 1 },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found.');

    const existing = await this.maintenanceRepo.findOne({
      where: { vehicle: vehicle },
    });
    if (existing && existing.status !== MaintenanceStatus.COMPLETED) {
      throw new BadRequestException(
        'This vehicle already has an active maintenance.',
      );
    }

    const now = Math.floor(Date.now() / 1000);
    const maintenance = this.maintenanceRepo.create({
      id: uuid(),
      createdDate: now,
      lastUpdateDate: now,
      version: 1,
      isActive: 1,
      vehicle,
      startDate: now,
      endDate: null,
      description: dto.description ?? '',
      cost: dto.cost,
      responsible: user,
      status: MaintenanceStatus.PENDING,
    });
    await this.maintenanceRepo.save(maintenance);
    vehicle.status = 'inMaintenance';
    return await this.vehicleRepo.save(vehicle);
  }

  async finishMaintenance(id: string, authorization: string) {
    const user = await this.authSsoService.getUserByToken(authorization);
    const isMechanic = user.rolUsers?.some(
      (rolUser: any) => rolUser.rol?.name === 'mechanic',
    );
    if (!isMechanic)
      throw new ForbiddenException('Only mechanics can finish maintenance.');

    const maintenance = await this.maintenanceRepo.findOne({
      where: { id: id, isActive: 1 },
      relations: ['vehicle'],
    });
    if (!maintenance) throw new NotFoundException('Maintenance not found.');
    if (maintenance.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new BadRequestException('Maintenance is not in progress.');
    }

    const now = Math.floor(Date.now() / 1000);
    maintenance.endDate = now;
    maintenance.status = MaintenanceStatus.COMPLETED;
    maintenance.lastUpdateDate = now;
    await this.maintenanceRepo.save(maintenance);

    maintenance.vehicle.status = 'available';
    await this.vehicleRepo.save(maintenance.vehicle);

    return maintenance;
  }

  async setInProgress(id: string, authorization: string) {
    const user = await this.authSsoService.getUserByToken(authorization);
    const isMechanic = user.rolUsers?.some(
      (rolUser: any) => rolUser.rol?.name === 'mechanic',
    );
    if (!isMechanic)
      throw new ForbiddenException(
        'Only mechanics can set maintenance in progress.',
      );

    const maintenance = await this.maintenanceRepo.findOne({
      where: { id },
      relations: ['vehicle'],
    });
    if (!maintenance) throw new NotFoundException('Maintenance not found.');
    if (maintenance.status !== MaintenanceStatus.PENDING) {
      throw new BadRequestException('Maintenance is not pending.');
    }

    maintenance.status = MaintenanceStatus.IN_PROGRESS;
    maintenance.lastUpdateDate = Math.floor(Date.now() / 1000);
    await this.maintenanceRepo.save(maintenance);

    maintenance.vehicle.status = 'inMaintenance';
    await this.vehicleRepo.save(maintenance.vehicle);

    return maintenance;
  }

  async findAll(): Promise<MaintenanceEntity[]> {
    return await this.maintenanceRepo.find({
      relations: ['vehicle', 'responsible'],
    });
  }

  async findOne(id: string): Promise<MaintenanceEntity> {
    const maintenance = await this.maintenanceRepo.findOne({
      where: { id },
      relations: ['vehicle', 'responsible'],
    });
    if (!maintenance) throw new NotFoundException('Maintenance not found.');
    return maintenance;
  }

  async update(id: string, dto: UpdateMaintenanceDto, authorization: string) {
    const user = await this.authSsoService.getUserByToken(authorization);
    const isMechanic = user.rolUsers?.some(
      (rolUser: any) => rolUser.rol?.name === 'mechanic',
    );
    if (!isMechanic)
      throw new ForbiddenException('Only mechanics can update maintenance.');

    const maintenance = await this.findOne(id);
    Object.assign(maintenance, dto, {
      lastUpdateDate: Math.floor(Date.now() / 1000),
    });
    return await this.maintenanceRepo.save(maintenance);
  }

  async delete(id: string, authorization: string) {
    const user = await this.authSsoService.getUserByToken(authorization);
    const isMechanic = user.rolUsers?.some(
      (rolUser: any) => rolUser.rol?.name === 'mechanic',
    );
    if (!isMechanic)
      throw new ForbiddenException('Only mechanics can delete maintenance.');

    const maintenance = await this.findOne(id);
    maintenance.isActive = 0;
    await this.maintenanceRepo.save(maintenance);
    return { message: 'Maintenance deleted' };
  }
}
