import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/createBooking.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/rolDecorator.service';
import { RolesGuard } from '../common/guards/rolesguard.service';

@ApiTags('Booking')
@ApiBearerAuth('access-token')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/create/')
  @ApiOperation({ summary: 'Crear una reserva' })
  @ApiResponse({ status: 201, description: 'Reserva creada exitosamente' })
  async createBooking(
    @Body() bookingData: CreateBookingDto,
    @Headers('authorization') authorization: string,
  ) {
    return await this.bookingService.createBooking(bookingData, authorization);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('/get-all/')
  @ApiOperation({ summary: 'Obtener todas las reservas activas' })
  @ApiResponse({ status: 200, description: 'Lista de reservas activas' })
  async findAllBookings() {
    return await this.bookingService.findAllBookings();
  }

  @Get('/get-by-user/')
  @ApiOperation({ summary: 'Obtener reservas del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Reservas del usuario' })
  async findUserBookings(@Headers('authorization') authorization: string) {
    return await this.bookingService.findUserBookings(authorization);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancelar una reserva' })
  @ApiParam({ name: 'id', description: 'ID de la reserva', type: String })
  @ApiResponse({ status: 200, description: 'Reserva cancelada exitosamente' })
  async cancelBooking(
    @Param('id') bookingId: string,
    @Headers('authorization') authorization: string,
  ) {
    return await this.bookingService.cancelBooking(bookingId, authorization);
  }

  @Put(':id/finish')
  @ApiOperation({ summary: 'Finalizar una reserva' })
  @ApiParam({ name: 'id', description: 'ID de la reserva', type: String })
  @ApiResponse({ status: 200, description: 'Reserva finalizada exitosamente' })
  async finishBooking(
    @Param('id') bookingId: string,
    @Headers('authorization') authorization: string,
  ) {
    return await this.bookingService.finishBooking(bookingId, authorization);
  }
}
