import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto, UpdateVehicleDto, VehicleDto } from './dto/cars.dto';

@Injectable()
export class VehicleService {
  private vehicle: VehicleDto[] = [
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

  async findAll(type?: string, status?: string): Promise<VehicleDto[]> {
    console.log('🚀 ~ CarService ~ findAll ~ status:', status);
    console.log('🚀 ~ CarService ~ findAll ~ type:', type);
    let filteredCars = this.vehicle;
    if (type) {
      filteredCars = filteredCars.filter((vehicle) => vehicle.type === type);
    }
    if (status) {
      filteredCars = filteredCars.filter((vehicle) => vehicle.status === status);
    }
    return filteredCars;
  }

  async findOne(id: string): Promise<VehicleDto> {
    const car = this.vehicle.find((vehicle) => vehicle.id === id);
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return car;
  }

  async createVehicle(carData: CreateVehicleDto): Promise<VehicleDto> {
    const exists = this.vehicle.find(
      (vehicle) =>
        vehicle.brand === carData.brand &&
        vehicle.model === carData.model &&
        vehicle.year === carData.year,
    );
    if (exists) {
      throw new ConflictException('Car already exists in inventory');
    }
    if (carData.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }
    const newCar: VehicleDto = {
      ...carData,
      id: `${Date.now()}`,
    };
    this.vehicle.push(newCar);
    return newCar;
  }

  async deleteVehicle(id: string): Promise<{ message: string }> {
    const index = this.vehicle.findIndex((car) => car.id === id);
    if (index === -1) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    this.vehicle.splice(index, 1);
    return { message: 'Car deleted from inventory' };
  }

  async updateVehicle(id: string, changes: UpdateVehicleDto): Promise<VehicleDto> {
    const index = this.vehicle.findIndex((car) => car.id === id);
    if (index === -1) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    if (changes.price && changes.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }
    const updatedCar = { ...this.vehicle[index], ...changes };
    this.vehicle[index] = updatedCar;
    return updatedCar;
  }

  async sellVehicle(id: string): Promise<{ message: string; car: VehicleDto }> {
    const car = this.vehicle.find((car) => car.id === id);
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
