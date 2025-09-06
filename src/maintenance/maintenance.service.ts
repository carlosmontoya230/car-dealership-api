import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  CreateMaintenanceDto,
  MaintenanceDto,
  UpdateMaintenanceDto,
} from './dto/maintenanceController.dto';

@Injectable()
export class MaintenanceService {
  private maintenances: MaintenanceDto[] = [
    {
      id: '1',
      carId: '1',
      type: 'Cambio de aceite',
      date: '2025-09-01',
      notes: 'Sin observaciones',
    },
    {
      id: '2',
      carId: '2',
      type: 'Revisión de frenos',
      date: '2025-08-15',
      notes: 'Pastillas cambiadas',
    },
  ];

  async findAll(): Promise<MaintenanceDto[]> {
    return this.maintenances;
  }

  async findOne(id: string): Promise<MaintenanceDto> {
    const maintenance = this.maintenances.find((m) => m.id === id);
    if (!maintenance) {
      throw new NotFoundException(`Maintenance with id ${id} not found`);
    }
    return maintenance;
  }

  async createMaintenance(data: CreateMaintenanceDto): Promise<MaintenanceDto> {
    const exists = this.maintenances.find((m) => m.id === data.id);
    if (exists) {
      throw new ConflictException('Maintenance with this ID already exists');
    }
    const newMaintenance: MaintenanceDto = { ...data };
    this.maintenances.push(newMaintenance);
    return newMaintenance;
  }

  async updateMaintenance(
    id: string,
    changes: UpdateMaintenanceDto,
  ): Promise<MaintenanceDto> {
    const index = this.maintenances.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Maintenance with id ${id} not found`);
    }
    const updated = { ...this.maintenances[index], ...changes };
    this.maintenances[index] = updated;
    return updated;
  }

  async deleteMaintenance(id: string): Promise<{ message: string }> {
    const index = this.maintenances.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Maintenance with id ${id} not found`);
    }
    this.maintenances.splice(index, 1);
    return { message: 'Maintenance deleted' };
  }
}
