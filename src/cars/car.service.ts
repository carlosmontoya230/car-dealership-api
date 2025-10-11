import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto, UpdateCarDto, CarDto } from './dto/cars.dto';

@Injectable()
export class CarService {
  private cars: CarDto[] = [
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

  async findAll(type?: string, status?: string): Promise<CarDto[]> {
    console.log('🚀 ~ CarService ~ findAll ~ status:', status);
    console.log('🚀 ~ CarService ~ findAll ~ type:', type);
    let filteredCars = this.cars;
    if (type) {
      filteredCars = filteredCars.filter((car) => car.type === type);
    }
    if (status) {
      filteredCars = filteredCars.filter((car) => car.status === status);
    }
    return filteredCars;
  }

  async findOne(id: string): Promise<CarDto> {
    const car = this.cars.find((car) => car.id === id);
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return car;
  }

  async createCar(carData: CreateCarDto): Promise<CarDto> {
    const exists = this.cars.find(
      (car) =>
        car.brand === carData.brand &&
        car.model === carData.model &&
        car.year === carData.year,
    );
    if (exists) {
      throw new ConflictException('Car already exists in inventory');
    }
    if (carData.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }
    const newCar: CarDto = {
      ...carData,
      id: `${Date.now()}`,
    };
    this.cars.push(newCar);
    return newCar;
  }

  async deleteCar(id: string): Promise<{ message: string }> {
    const index = this.cars.findIndex((car) => car.id === id);
    if (index === -1) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    this.cars.splice(index, 1);
    return { message: 'Car deleted from inventory' };
  }

  async updateCar(id: string, changes: UpdateCarDto): Promise<CarDto> {
    const index = this.cars.findIndex((car) => car.id === id);
    if (index === -1) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    if (changes.price && changes.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }
    const updatedCar = { ...this.cars[index], ...changes };
    this.cars[index] = updatedCar;
    return updatedCar;
  }

  async sellCar(id: string): Promise<{ message: string; car: CarDto }> {
    const car = this.cars.find((car) => car.id === id);
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    if (car.status === 'sold') {
      throw new BadRequestException('Car is already sold');
    }
    car.status = 'sold';
    return { message: 'Car sold successfully', car };
  }
}
