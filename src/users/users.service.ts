import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/createUser.dto';
import { RolEntity } from './entities/rol.entity';
import { RolUserEntity } from './entities/rol_user.entity';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(RolEntity)
    private readonly rolEntityRepository: Repository<RolEntity>,
    @InjectRepository(RolUserEntity)
    private readonly rolUserEntityRepository: Repository<RolUserEntity>,
  ) {}

  async createUser(userDto: CreateUserDto) {
    try {
      const existingUser = await this.userEntityRepository.findOne({
        where: { email: userDto.email },
      });
      if (existingUser) {
        throw new BadRequestException(
          'El correo ya está en uso. Crea uno nuevo.',
        );
      }
      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const newUser = this.userEntityRepository.create({
        ...userDto,
        id: uuid(),
        createdDate: Math.floor(Date.now() / 1000),
        lastUpdateDate: Math.floor(Date.now() / 1000),
        version: 1,
        isActive: 1,
        name: userDto.name,
        email: userDto.email,
        phone: userDto.phone,
        address: userDto.address,
        password: hashedPassword,
        rolUsers: [],
      });

      await this.userEntityRepository.save(newUser);

      // Asignar siempre el rol 'standard'
      const standardRol = await this.rolEntityRepository.findOne({
        where: { name: 'standard' },
      });
      if (!standardRol) {
        throw new BadRequestException('El rol "standard" no existe.');
      }
      const rolUsuario = this.rolUserEntityRepository.create({
        id: uuid(),
        createdDate: Math.floor(Date.now() / 1000),
        lastUpdateDate: Math.floor(Date.now() / 1000),
        version: 1,
        isActive: 1,
        userEmail: userDto.email,
        rolId: standardRol.id,
        user: newUser,
      });
      await this.rolUserEntityRepository.save(rolUsuario);

      return await this.findOne(userDto.email);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.userEntityRepository.find({
        where: { isActive: 1 },
        relations: ['rolUsers', 'rolUsers.rol'],
      });
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async findOne(email: string) {
    try {
      const user = await this.userEntityRepository.findOne({
        where: { email },
        relations: ['rolUsers', 'rolUsers.rol'],
      });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado.');
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async updateUser(email: string, userDto: UpdateUserDto) {
    try {
      const user = await this.userEntityRepository.findOne({
        where: { email },
        relations: ['rolUsers'],
      });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado.');
      }
      if (userDto.password) {
        userDto.password = await bcrypt.hash(userDto.password, 10);
      }
      const { rolUsers, ...userData } = userDto;
      if (Object.keys(userData).length > 0) {
        await this.userEntityRepository.update(user.id, userData);
      }
      if (rolUsers && rolUsers.length > 0) {
        await this.rolUserEntityRepository.delete({ userEmail: email });
        for (const rolId of rolUsers) {
          const rolUsuario = this.rolUserEntityRepository.create({
            id: uuid(),
            createdDate: Math.floor(Date.now() / 1000),
            lastUpdateDate: Math.floor(Date.now() / 1000),
            version: 1,
            isActive: 1,
            userEmail: email,
            rolId: rolId,
            user: user,
          });
          await this.rolUserEntityRepository.save(rolUsuario);
        }
      }
      return await this.findOne(email);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.userEntityRepository.findOne({
        where: { id, isActive: 1 },
      });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado o inactivo.');
      }
      await this.userEntityRepository.update(id, { isActive: 0 });
      return { message: 'Usuario eliminado exitosamente.' };
    } catch (error) {
      throw new BadRequestException(`Error deleting user: ${error.message}`);
    }
  }

  /**
  Roles de usuarios para asignar a los usuarios
  @since v17.2.0, v16.14.0
  @return A map of provider types to the corresponding numeric id.
  This map contains all the event types that might be emitted by the `async_hooks.init()` event.
  */

  async createRol(name: string) {
    try {
      const existingRol = await this.rolEntityRepository.findOne({
        where: { name },
      });
      if (existingRol) {
        throw new BadRequestException('El rol ya existe.');
      }
      const newRol = this.rolEntityRepository.create({
        id: uuid(),
        createdDate: Math.floor(Date.now() / 1000),
        lastUpdateDate: Math.floor(Date.now() / 1000),
        version: 1,
        isActive: 1,
        name,
      });
      await this.rolEntityRepository.save(newRol);
      return newRol;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al crear el rol: ${error.message}`);
    }
  }

  async getAllRols() {
    try {
      return await this.rolEntityRepository.find();
    } catch (error) {
      throw new Error(`Error fetching roles: ${error.message}`);
    }
  }
}
