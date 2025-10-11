import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsPositive } from 'class-validator';

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

  @ApiProperty({ example: 25000, description: 'Precio del auto' })
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 'new',
    description: 'Tipo de auto',
    enum: ['new', 'used', 'electric'],
  })
  @IsEnum(['new', 'used', 'electric'])
  type: 'new' | 'used' | 'electric';

  @ApiProperty({
    example: 'available',
    description: 'Estado del auto',
    enum: ['available', 'sold', 'maintenance'],
  })
  @IsEnum(['available', 'sold', 'maintenance'])
  status: 'available' | 'sold' | 'maintenance';
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}

export class VehicleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: ['new', 'used', 'electric'] })
  type: 'new' | 'used' | 'electric';

  @ApiProperty({ enum: ['available', 'sold', 'maintenance'] })
  status: 'available' | 'sold' | 'maintenance';
}
