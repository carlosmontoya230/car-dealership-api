import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthSsoService } from '../auth/dto/auth-sso.service';
import { CreateBookingDto } from './dto/createBooking.dto';
import { BookingEntity } from './entities/booking.entity';
import { VehicleService } from '../vehicle/vehicle.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BookingService {
  constructor(
    private authSsoService: AuthSsoService,
    private vehicleService: VehicleService,
    @InjectRepository(BookingEntity)
    private readonly bookingEntityRepository: Repository<BookingEntity>,
  ) {}

  async createBooking(bookingData: CreateBookingDto, authorization: string) {
    try {
      const user = await this.authSsoService.getUserByToken(authorization);
      const vehicle = await this.vehicleService.findOne(bookingData.vehicleId);
      if (!vehicle) {
        throw new Error('Vehículo no encontrado');
      }
      if (vehicle.status !== 'available') {
        return {
          message:
            'El vehículo no está disponible para reserva, escoger otro vehiculo para realizar la reserva.',
        };
      }

      const newBooking = this.bookingEntityRepository.create({
        ...bookingData,
        id: uuid(),
        createdDate: Math.floor(Date.now() / 1000),
        lastUpdateDate: Math.floor(Date.now() / 1000),
        version: 1,
        isActive: 1,
        user: user.id,
        vehicle: bookingData.vehicleId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        status: 'reserved',
      });
      await this.bookingEntityRepository.save(newBooking);
      await this.vehicleService.updateVehicle(bookingData.vehicleId, {
        status: 'reserved',
      });
      return {
        message: 'Reserva creada exitosamente',
        booking: newBooking,
      };
    } catch (error) {
      throw error;
    }
  }

  async cancelBooking(bookingId: string, authorization: string) {
    try {
      const user = await this.authSsoService.getUserByToken(authorization);
      const booking = await this.bookingEntityRepository.findOne({
        where: { id: bookingId, isActive: 1 },
      });

      if (!booking) {
        return { message: 'Reserva no encontrada o ya cancelada.' };
      }
      const isAdmin = user.rolUsers?.some(
        (rolUser: any) => rolUser.rol?.name === 'admin',
      );
      if (booking.user !== user.id && !isAdmin) {
        return { message: 'No autorizado para cancelar esta reserva.' };
      }

      booking.status = 'cancelled';
      booking.lastUpdateDate = Math.floor(Date.now() / 1000);
      booking.isActive = 0;
      await this.bookingEntityRepository.save(booking);
      await this.vehicleService.updateVehicle(booking.vehicle, {
        status: 'available',
      });

      return { message: 'Reserva cancelada exitosamente.' };
    } catch (error) {
      throw error;
    }
  }

  async finishBooking(bookingId: string, authorization: string) {
    try {
      const user = await this.authSsoService.getUserByToken(authorization);
      const booking = await this.bookingEntityRepository.findOne({
        where: { id: bookingId, isActive: 1 },
      });

      if (!booking) {
        return { message: 'Reserva no encontrada o ya finalizada.' };
      }
      const isAdmin = user.rolUsers?.some(
        (rolUser: any) => rolUser.rol?.name === 'admin',
      );
      if (booking.user !== user.id && !isAdmin) {
        return { message: 'No autorizado para terminar esta reserva.' };
      }

      booking.status = 'finished';
      booking.lastUpdateDate = Math.floor(Date.now() / 1000);
      booking.isActive = 0;
      await this.bookingEntityRepository.save(booking);
      await this.vehicleService.updateVehicle(booking.vehicle, {
        status: 'available',
      });

      return { message: 'Reserva finalizada exitosamente.' };
    } catch (error) {
      throw error;
    }
  }

  async findAllBookings() {
    try {
      const bookings = await this.bookingEntityRepository.find({
        where: { isActive: 1 },
      });
      if (!bookings || bookings.length === 0) {
        return { message: 'No se encontraron reservas activas.' };
      }
      for (const booking of bookings) {
        booking['vehicleDetails'] = await this.vehicleService.findOne(
          booking.vehicle,
        );
      }
      return bookings;
    } catch (error) {
      throw error;
    }
  }

  async findUserBookings(authorization: string) {
    try {
      const user = await this.authSsoService.getUserByToken(authorization);
      const bookings = await this.bookingEntityRepository.find({
        where: { user: user.id, isActive: 1 },
      });
      if (!bookings || bookings.length === 0) {
        return { message: 'No se encontraron reservas para este usuario.' };
      }
      for (const booking of bookings) {
        booking['vehicleDetails'] = await this.vehicleService.findOne(
          booking.vehicle,
        );
      }
      return bookings;
    } catch (error) {
      throw error;
    }
  }
}
