import { BookingModule } from './booking/booking.module';
import { CountriesModule } from './countries/countries.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthSsoModule } from './auth/dto/auth-sso.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { RolEntity } from './users/entities/rol.entity';
import { RolUserEntity } from './users/entities/rol_user.entity';
import { UserEntity } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';
import { CarsModule } from './vehicle/vehicle.module';
import { BookingEntity } from './booking/entities/booking.entity';
import { VehicleEntity } from './vehicle/entities/vehicle.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate:
          process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true,
      },
      logging: false,
      synchronize: true,
      entities: [
        UserEntity,
        RolEntity,
        RolUserEntity,
        VehicleEntity,
        BookingEntity,
      ],
    }),
    MaintenanceModule,
    CarsModule,
    UsersModule,
    AuthSsoModule,
    CountriesModule,
    BookingModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
