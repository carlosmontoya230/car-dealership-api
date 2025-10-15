import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID del vehículo',
    type: String,
    maxLength: 100,
    example: 'vehicle-67890',
  })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({
    description: 'Fecha de inicio de la reserva (timestamp en milisegundos)',
    type: Number,
    example: 1719878400000,
  })
  @IsNumber()
  @IsNotEmpty()
  startDate: number;

  @ApiProperty({
    description: 'Fecha de fin de la reserva (timestamp en milisegundos)',
    type: Number,
    example: 1719964800000,
  })
  @IsNumber()
  @IsNotEmpty()
  endDate: number;
}
