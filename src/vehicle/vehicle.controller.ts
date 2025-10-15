import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateVehicleDto, UpdateVehicleDto, VehicleDto } from './dto/cars.dto';
import { VehicleService } from './vehicle.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/rolDecorator.service';
import { RolesGuard } from '../common/guards/rolesguard.service';

@ApiTags('Cars')
@Controller('cars')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Roles('client')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los autos' })
  @ApiResponse({ status: 200, description: 'Lista de autos' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Tipo de auto',
    type: String,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Estado del auto',
    type: String,
  })
  @ApiQuery({
    name: 'carPlate',
    required: false,
    description: 'Placa del auto',
    type: String,
  })
  async getCars(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('carPlate') carPlate?: string,
  ) {
    return await this.vehicleService.findAll(
      type?.trim() || undefined,
      status?.trim() || undefined,
      carPlate?.trim() || undefined,
    );
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Roles('client')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener auto por ID' })
  @ApiParam({ name: 'id', description: 'ID del auto', type: String })
  @ApiResponse({
    status: 200,
    description: 'Auto encontrado',
    type: VehicleDto,
  })
  @ApiResponse({ status: 404, description: 'Auto no encontrado' })
  async getCar(@Param('id') id: string) {
    return await this.vehicleService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Crear auto' })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({ status: 201, description: 'Auto creado', type: VehicleDto })
  @ApiResponse({ status: 409, description: 'El vehículo ya existe.' })
  async createCar(@Body() body: CreateVehicleDto) {
    return await this.vehicleService.createVehicle(body);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar auto por ID' })
  @ApiParam({ name: 'id', description: 'ID del auto', type: String })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({
    status: 200,
    description: 'Auto actualizado',
    type: VehicleDto,
  })
  @ApiResponse({ status: 404, description: 'Auto no encontrado' })
  async updateCar(@Param('id') id: string, @Body() changes: UpdateVehicleDto) {
    return await this.vehicleService.updateVehicle(id, changes);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar auto por ID (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del auto', type: String })
  @ApiResponse({
    status: 200,
    description: 'Auto eliminado',
    schema: {
      example: {
        message: 'Vehículo con ID 123 eliminado correctamente (soft delete)',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Auto no encontrado' })
  async deleteCar(@Param('id') id: string) {
    return await this.vehicleService.deleteVehicle(id);
  }
}
