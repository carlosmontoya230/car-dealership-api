import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { CreateCarDto, UpdateVehicleDto } from './dto/cars.dto';

@ApiTags('Cars')
@Controller('cars')
export class VehicleController {
  constructor(private readonly cehicleService: VehicleService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los autos' })
  @ApiResponse({ status: 200, description: 'Lista de autos' })
  @ApiParam({
    name: 'type',
    required: false,
    description: 'Tipo de auto',
    type: String,
  })
  @ApiParam({
    name: 'status',
    required: false,
    description: 'Estado del auto',
    type: String,
  })
  async getCars(@Query('type') type: string, @Query('status') status: string) {
    return await this.carService.findAll(type, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener auto por ID' })
  @ApiParam({ name: 'id', description: 'ID del auto' })
  @ApiResponse({ status: 200, description: 'Auto encontrado' })
  async getCar(@Param('id') id: string) {
    return await this.carService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear auto' })
  @ApiBody({ type: CreateCarDto })
  @ApiResponse({ status: 201, description: 'Auto creado' })
  async createCar(@Body() body: CreateCarDto) {
    return await this.carService.createCar(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar auto por ID' })
  @ApiParam({ name: 'id', description: 'ID del auto' })
  @ApiResponse({ status: 200, description: 'Auto eliminado' })
  async deleteCar(@Param('id') id: string) {
    return await this.carService.deleteCar(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar auto por ID' })
  @ApiParam({ name: 'id', description: 'ID del auto' })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({ status: 200, description: 'Auto actualizado' })
  async updateCar(@Param('id') id: string, @Body() changes: UpdateVehicleDto) {
    return await this.carService.updateCar(id, changes);
  }

  @Post(':id/sell')
  @ApiOperation({ summary: 'Vender auto por ID' })
  @ApiParam({ name: 'id', description: 'ID del auto' })
  @ApiResponse({ status: 200, description: 'Auto vendido' })
  async sellCar(@Param('id') id: string) {
    return await this.carService.sellCar(id);
  }
}
