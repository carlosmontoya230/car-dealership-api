import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor() {}
  usersData = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+1234567890',
      address: 'Calle 123, Ciudad',
      password: 'clave123',
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@example.com',
      phone: '+0987654321',
      address: 'Avenida 456, Ciudad',
      password: 'clave456',
    },
    {
      id: '3',
      name: 'Carlos Rodríguez',
      email: 'c.rodriguez@example.com',
      phone: '+3456789012',
      address: 'Plaza Mayor 78, Ciudad',
      password: 'clave789',
    },
    {
      id: '4',
      name: 'Ana Martínez',
      email: 'ana.martinez@example.com',
      phone: '+4567890123',
      address: 'Calle Sol 45, Ciudad',
      password: 'clave101',
    },
    {
      id: '5',
      name: 'Pedro López',
      email: 'pedro.lopez@example.com',
      phone: '+5678901234',
      address: 'Avenida Libertad 112, Ciudad',
      password: 'clave202',
    },
  ];

  async createUser(userDto: CreateUserDto) {
    try {
      const { id, name, email, phone, address, password } = userDto;
      // Verificar si el email ya existe
      const existingUser = this.usersData.find((user) => user.email === email);
      console.log(
        '🚀 ~ UsersService ~ createUser ~ existingUser:',
        existingUser,
      );

      const existingidUser = this.usersData.find((user) => user.id === id);
      if (existingUser) {
        throw new BadRequestException('El email ya está registrado.');
      }
      if (existingidUser) {
        throw new BadRequestException('El ID ya está registrado.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const usuario = {
        id,
        name,
        email,
        phone,
        address,
        password: hashedPassword,
      };
      this.usersData.push(usuario);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return this.usersData.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async findOne(email: string) {
    try {
      const user = this.usersData.find((user) => user.email === email);
      if (!user) {
        throw new BadRequestException('Usuario no encontrado.');
      }
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async deleteUser(id: string) {
    try {
      const userIndex = this.usersData.findIndex((user) => user.id === id);
      if (!userIndex) {
        throw new BadRequestException('Usuario no encontrado.');
      }
      this.usersData.splice(userIndex, 1);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}
