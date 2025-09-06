import { MaintenanceModule } from './maintenance/maintenance.module';
import { CarService } from './cars/car.service';
import { CarsModule } from './cars/cars.module';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthSsoModule } from './auth/dto/auth-sso.module';

@Module({
  imports: [
    MaintenanceModule,
    CarsModule,
    UsersModule,
    AuthSsoModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
