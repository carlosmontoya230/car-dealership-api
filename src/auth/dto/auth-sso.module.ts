import { Module } from '@nestjs/common';
import { AuthSsoController } from './auth-sso.controller';

import { config } from 'dotenv';
import { AuthSsoService } from './auth-sso.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from 'src/common/guards/jwt.strategy';
config();
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthSsoController],
  providers: [AuthSsoService, UsersService, JwtStrategy],
})
export class AuthSsoModule {}
