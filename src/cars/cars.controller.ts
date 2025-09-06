import {
  BadRequestException,
  Body,
  ConflictException,
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

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  type: 'new' | 'used' | 'electric';
  status: 'available' | 'sold' | 'maintenance';
}

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  private cars: Car[] = [
    {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2023,
      price: 25000,
      type: 'new',
      status: 'available',
    },
    {
      id: '2',
      brand: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 45000,
      type: 'electric',
      status: 'available',
    },
    {
      id: '3',
      brand: 'Honda',
      model: 'Civic',
      year: 2020,
      price: 18000,
      type: 'used',
      status: 'sold',
    },
  ];

  @Get()
  getCars(@Query('type') type?: string, @Query('status') status?: string) {
    let filteredCars = this.cars;

    if (type) {
      filteredCars = filteredCars.filter((car) => car.type === type);
    }

    if (status) {
      filteredCars = filteredCars.filter((car) => car.status === status);
    }

    return filteredCars;
  }

  @Get(':id')
  getCar(@Param('id') id: string) {
    const car = this.cars.find((car) => car.id === id);
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return car;
  }

  @Post()
  createCar(@Body() body: Omit<Car, 'id'>) {
    // Verificar si ya existe un auto con misma marca, modelo y año
    const existingCar = this.cars.find(
      (car) =>
        car.brand === body.brand &&
        car.model === body.model &&
        car.year === body.year,
    );

    if (existingCar) {
      throw new ConflictException('Car already exists in inventory');
    }

    if (body.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    const newCar = {
      ...body,
      id: `${new Date().getTime()}`,
    };
    this.cars.push(newCar);
    return newCar;
  }

  @Delete(':id')
  deleteCar(@Param('id') id: string) {
    const position = this.cars.findIndex((car) => car.id === id);
    if (position === -1) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    this.cars = this.cars.filter((car) => car.id !== id);
    return {
      message: 'Car deleted from inventory',
    };
  }

  @Put(':id')
  updateCar(@Param('id') id: string, @Body() changes: Partial<Car>) {
    const position = this.cars.findIndex((car) => car.id === id);
    if (position === -1) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }

    if (changes.price && changes.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    const currentData = this.cars[position];
    const updatedCar = {
      ...currentData,
      ...changes,
    };
    this.cars[position] = updatedCar;
    return updatedCar;
  }

  @Post(':id/sell')
  sellCar(@Param('id') id: string) {
    const car = this.cars.find((car) => car.id === id);
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }

    if (car.status === 'sold') {
      throw new BadRequestException('Car is already sold');
    }

    car.status = 'sold';
    return {
      message: 'Car sold successfully',
      car,
    };
  }
}
