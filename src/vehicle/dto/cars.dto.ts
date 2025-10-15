import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota', description: 'Marca del auto' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Corolla', description: 'Modelo del auto' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2023, description: 'Año del auto' })
  @IsNumber()
  year: number;

  @ApiProperty({ example: 'Sedan', description: 'Tipo de auto' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'ABC123', description: 'Placa del auto' })
  @IsString()
  carPlate: string;

  @ApiProperty({ example: 'Rojo', description: 'Color del auto' })
  @IsString()
  color: string;

  @ApiProperty({ example: 0, description: 'Kilometraje actual' })
  @IsNumber()
  currentKm: number;

  @ApiProperty({
    example: 'available',
    description: 'Estado del auto',
    enum: ['available', 'rented', 'reserved', 'inMaintenance'],
  })
  @IsEnum(['available', 'rented', 'reserved', 'inMaintenance'])
  status: 'available' | 'rented' | 'reserved' | 'inMaintenance';

  @ApiProperty({ example: 'México', description: 'País' })
  @IsString()
  country: string;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}

export class VehicleDto {
  @ApiProperty({ example: 'Toyota', description: 'Marca del auto' })
  brand: string;

  @ApiProperty({ example: 'Corolla', description: 'Modelo del auto' })
  model: string;

  @ApiProperty({ example: 2023, description: 'Año del auto' })
  year: number;

  @ApiProperty({ example: 'Sedan', description: 'Tipo de auto' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'ABC123', description: 'Placa del auto' })
  carPlate: string;

  @ApiProperty({ example: 'Rojo', description: 'Color del auto' })
  color: string;

  @ApiProperty({ example: 0, description: 'Kilometraje actual' })
  currentKm: number;

  @ApiProperty({ example: 'available', description: 'Estado del auto' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'México', description: 'País' })
  country: string;
}
