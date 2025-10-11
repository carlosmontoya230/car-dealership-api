import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import {
  CreateMaintenanceDto,
  MaintenanceDto,
  UpdateMaintenanceDto,
} from './dto/maintenanceController.dto';

@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los mantenimientos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de mantenimientos',
    type: [MaintenanceDto],
  })
  async findAll() {
    return await this.maintenanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener mantenimiento por ID' })
  @ApiParam({ name: 'id', description: 'ID del mantenimiento' })
  @ApiResponse({
    status: 200,
    description: 'Mantenimiento encontrado',
    type: MaintenanceDto,
  })
  async findOne(@Param('id') id: string) {
    return await this.maintenanceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear mantenimiento' })
  @ApiBody({ type: CreateMaintenanceDto })
  @ApiResponse({
    status: 201,
    description: 'Mantenimiento creado',
    type: MaintenanceDto,
  })
  async create(@Body() body: CreateMaintenanceDto) {
    return await this.maintenanceService.createMaintenance(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar mantenimiento por ID' })
  @ApiParam({ name: 'id', description: 'ID del mantenimiento' })
  @ApiBody({ type: UpdateMaintenanceDto })
  @ApiResponse({
    status: 200,
    description: 'Mantenimiento actualizado',
    type: MaintenanceDto,
  })
  async update(@Param('id') id: string, @Body() changes: UpdateMaintenanceDto) {
    return await this.maintenanceService.updateMaintenance(id, changes);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar mantenimiento por ID' })
  @ApiParam({ name: 'id', description: 'ID del mantenimiento' })
  @ApiResponse({ status: 200, description: 'Mantenimiento eliminado' })
  async delete(@Param('id') id: string) {
    return await this.maintenanceService.deleteMaintenance(id);
  }
}
