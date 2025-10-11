import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { Module } from '@nestjs/common';
import { UserEntity } from './entities/users.entity';
import { RolEntity } from './entities/rol.entity';
import { RolUserEntity } from './entities/rol_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RolEntity, RolUserEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
