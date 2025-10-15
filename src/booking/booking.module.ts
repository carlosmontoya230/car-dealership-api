import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { UserEntity } from '../users/entities/users.entity';
import { RolEntity } from '../users/entities/rol.entity';
import { RolUserEntity } from '../users/entities/rol_user.entity';
import { VehicleEntity } from '../vehicle/entities/vehicle.entity';
import { BookingEntity } from './entities/booking.entity';
import { AuthSsoService } from '../auth/dto/auth-sso.service';
import { JwtService } from '@nestjs/jwt';
import { VehicleService } from '../vehicle/vehicle.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RolEntity,
      RolUserEntity,
      VehicleEntity,
      BookingEntity,
    ]),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    AuthSsoService,
    UsersService,
    JwtService,
    VehicleService,
  ],
})
export class BookingModule {}
