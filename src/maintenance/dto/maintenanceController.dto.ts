import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { MaintenanceStatus } from '../entities/maintenance.entity';

export class CreateMaintenanceDto {
  @ApiProperty({ example: 'ABC123', description: 'Vehicle plate' })
  @IsString()
  carPlate: string;

  @ApiProperty({ example: 'Oil change', description: 'Work description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 100.0, description: 'Cost' })
  @IsNumber()
  cost: number;
}

export class UpdateMaintenanceDto extends PartialType(CreateMaintenanceDto) {
  @ApiProperty({
    example: 1700000000,
    description: 'End date (timestamp)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  endDate?: number;

  @ApiProperty({
    example: 'completed',
    enum: MaintenanceStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;
}

export class MaintenanceDto extends PartialType(CreateMaintenanceDto) {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vehicle: any;

  @ApiProperty()
  startDate: number;

  @ApiProperty({ required: false })
  endDate?: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  responsible: any;

  @ApiProperty({ enum: MaintenanceStatus })
  status: MaintenanceStatus;
}
