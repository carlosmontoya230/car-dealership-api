import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { VehicleEntity } from './entities/vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto, VehicleDto } from './dto/cars.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepo: Repository<VehicleEntity>,
  ) {}

  async createVehicle(carData: CreateVehicleDto): Promise<VehicleDto> {
    try {
      const exists = await this.vehicleRepo.findOne({
        where: { carPlate: carData.carPlate },
      });

      if (exists) throw new ConflictException('El vehículo ya existe.');

      const entity = this.vehicleRepo.create({
        ...carData,
        id: uuid(),
        createdDate: Math.floor(Date.now() / 1000),
        lastUpdateDate: Math.floor(Date.now() / 1000),
        version: 1,
        isActive: 1,
        status: 'available',
      });

      return await this.vehicleRepo.save(entity);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el vehículo: ${error.message}`,
      );
    }
  }

  async findAll(
    type?: string,
    status?: string,
    carPlate?: string,
  ): Promise<VehicleDto[]> {
    try {
      const query = this.vehicleRepo.createQueryBuilder('vehicle');
      query.where('vehicle.isActive = :active', { active: 1 });

      if (type && type.trim() !== '')
        query.andWhere('LOWER(vehicle.type) LIKE LOWER(:type)', {
          type: `%${type}%`,
        });

      if (status && status.trim() !== '')
        query.andWhere('LOWER(vehicle.status) LIKE LOWER(:status)', {
          status: `%${status}%`,
        });

      if (carPlate && carPlate.trim() !== '')
        query.andWhere('LOWER(vehicle.carPlate) LIKE LOWER(:carPlate)', {
          carPlate: `%${carPlate}%`,
        });

      query.orderBy('vehicle.createdDate', 'DESC');

      const result = await query.getMany();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener los vehículos: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<VehicleDto> {
    try {
      const vehicle = await this.vehicleRepo.findOne({ where: { id } });
      if (!vehicle) {
        throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
      }
      return vehicle;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar el vehículo: ${error.message}`,
      );
    }
  }

  async updateVehicle(
    id: string,
    changes: UpdateVehicleDto,
  ): Promise<VehicleDto> {
    try {
      const vehicle = await this.vehicleRepo.findOne({ where: { id } });
      if (!vehicle) {
        throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
      }

      const exists = await this.vehicleRepo.findOne({
        where: { carPlate: changes.carPlate },
      });

      if (!exists) throw new ConflictException('El vehículo No existe.');

      const updatedVehicle = this.vehicleRepo.merge(vehicle, {
        ...changes,
        status: changes.status || vehicle.status,
        lastUpdateDate: Math.floor(Date.now() / 1000),
        version: Number(vehicle.version) + 1,
      });

      return await this.vehicleRepo.save(updatedVehicle);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el vehículo: ${error.message}`,
      );
    }
  }

  async deleteVehicle(id: string): Promise<{ message: string }> {
    try {
      const vehicle = await this.vehicleRepo.findOne({ where: { id } });
      if (!vehicle) {
        throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
      }
      vehicle.isActive = 0;
      await this.vehicleRepo.save(vehicle);
      return {
        message: `Vehículo con ID ${id} eliminado correctamente (soft delete)`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar el vehículo: ${error.message}`,
      );
    }
  }
}
