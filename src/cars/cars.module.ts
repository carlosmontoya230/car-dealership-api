import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarService } from './car.service';

@Module({
  imports: [],
  controllers: [CarsController],
  providers: [CarService],
})
export class CarsModule {}
