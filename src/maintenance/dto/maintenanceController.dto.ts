import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateMaintenanceDto {
  @ApiProperty({ example: '1', description: 'ID del mantenimiento' })
  @IsString()
  id: string;

  @ApiProperty({ example: '1', description: 'ID del auto' })
  @IsString()
  carId: string;

  @ApiProperty({
    example: 'Cambio de aceite',
    description: 'Tipo de mantenimiento',
  })
  @IsString()
  type: string;

  @ApiProperty({ example: '2025-09-06', description: 'Fecha de mantenimiento' })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: 'Realizado sin inconvenientes',
    description: 'Observaciones',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMaintenanceDto extends PartialType(CreateMaintenanceDto) {}

export class MaintenanceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  carId: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  date: string;

  @ApiProperty({ required: false })
  notes?: string;
}
