import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

interface Maintenance {
  id: string;
  carId: string;
  clientId: string;
  serviceType:
    | 'oil_change'
    | 'tire_rotation'
    | 'brake_service'
    | 'battery_check';
  serviceDate: string;
  cost: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
  private maintenance: Maintenance[] = [
    {
      id: '1',
      carId: '1',
      clientId: '1',
      serviceType: 'oil_change',
      serviceDate: '2024-01-15',
      cost: 80,
      status: 'completed',
    },
    {
      id: '2',
      carId: '2',
      clientId: '2',
      serviceType: 'battery_check',
      serviceDate: '2024-01-20',
      cost: 50,
      status: 'scheduled',
    },
  ];

  @Get()
  getMaintenance(@Query('status') status?: string) {
    if (status) {
      return this.maintenance.filter((service) => service.status === status);
    }
    return this.maintenance;
  }

  @Get(':id')
  getMaintenanceService(@Param('id') id: string) {
    const service = this.maintenance.find((service) => service.id === id);
    if (!service) {
      throw new NotFoundException(
        `Maintenance service with id ${id} not found`,
      );
    }
    return service;
  }

  @Post()
  createMaintenance(@Body() body: Omit<Maintenance, 'id'>) {
    if (body.cost <= 0) {
      throw new BadRequestException('Cost must be greater than 0');
    }

    const newService = {
      ...body,
      id: `${new Date().getTime()}`,
    };
    this.maintenance.push(newService);
    return newService;
  }

  @Delete(':id')
  deleteMaintenance(@Param('id') id: string) {
    const position = this.maintenance.findIndex((service) => service.id === id);
    if (position === -1) {
      throw new NotFoundException(
        `Maintenance service with id ${id} not found`,
      );
    }
    this.maintenance = this.maintenance.filter((service) => service.id !== id);
    return {
      message: 'Maintenance service deleted',
    };
  }

  @Put(':id')
  updateMaintenance(
    @Param('id') id: string,
    @Body() changes: Partial<Maintenance>,
  ) {
    const position = this.maintenance.findIndex((service) => service.id === id);
    if (position === -1) {
      throw new NotFoundException(
        `Maintenance service with id ${id} not found`,
      );
    }

    if (changes.cost && changes.cost <= 0) {
      throw new BadRequestException('Cost must be greater than 0');
    }

    const currentData = this.maintenance[position];
    const updatedService = {
      ...currentData,
      ...changes,
    };
    this.maintenance[position] = updatedService;
    return updatedService;
  }

  @Post(':id/complete')
  completeMaintenance(@Param('id') id: string) {
    const service = this.maintenance.find((service) => service.id === id);
    if (!service) {
      throw new NotFoundException(
        `Maintenance service with id ${id} not found`,
      );
    }

    service.status = 'completed';
    return {
      message: 'Maintenance service completed',
      service,
    };
  }
}
