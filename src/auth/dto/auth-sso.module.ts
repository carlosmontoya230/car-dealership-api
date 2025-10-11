import { Module } from '@nestjs/common';
import { AuthSsoController } from './auth-sso.controller';

import { config } from 'dotenv';
import { AuthSsoService } from './auth-sso.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../common/guards/jwt.strategy';
import { UsersService } from '../../users/users.service';
import { UserEntity } from '../../users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolEntity } from '../../users/entities/rol.entity';
import { RolUserEntity } from '../../users/entities/rol_user.entity';
config();
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RolEntity, RolUserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthSsoController],
  providers: [AuthSsoService, UsersService, JwtStrategy],
})
export class AuthSsoModule {}
