import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceEntity } from './entities/maintenance.entity';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { VehicleEntity } from '../vehicle/entities/vehicle.entity';
import { AuthSsoService } from '../auth/dto/auth-sso.service';
import { UserEntity } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RolEntity } from '../users/entities/rol.entity';
import { RolUserEntity } from '../users/entities/rol_user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaintenanceEntity,
      VehicleEntity,
      UserEntity,
      RolEntity,
      RolUserEntity,
    ]),
  ],
  providers: [MaintenanceService, AuthSsoService, UsersService, JwtService],
  controllers: [MaintenanceController],
})
export class MaintenanceModule {}
