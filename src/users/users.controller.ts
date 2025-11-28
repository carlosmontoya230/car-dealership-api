import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/createUser.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/rolesguard.service';
import { Roles } from '../common/decorators/rolDecorator.service';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create-user/')
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Datos para crear un nuevo usuario',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o usuario ya existe.',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);
    return { message: 'Usuario creado correctamente.' };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('/all/Users/')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('/user/:email')
  @ApiOperation({ summary: 'Obtener usuario por email' })
  @ApiParam({
    name: 'email',
    type: String,
    required: true,
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado.',
    schema: {
      example: {
        id: '123',
        nombre: 'Juan',
        email: 'usuario@ejemplo.com',
      },
    },
  })
  async findOne(@Param('email') email: string) {
    return await this.usersService.findOne(email);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post('/update/:email')
  @ApiOperation({ summary: 'Actualizar usuario por email' })
  @ApiParam({
    name: 'email',
    type: String,
    required: true,
    description: 'Correo electrónico del usuario a actualizar',
    example: 'usuario@ejemplo.com',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Datos para actualizar el usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente.',
    schema: {
      example: {
        id: '123',
        nombre: 'Juan',
        email: 'usuario@ejemplo.com',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o usuario no encontrado.',
  })
  async updateUser(
    @Param('email') email: string,
    @Body() userDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(email, userDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete('/delete-user/:id')
  @ApiOperation({ summary: 'Eliminar usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return { message: 'Usuario eliminado correctamente.' };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post('/create-rol/')
  @ApiOperation({ summary: 'Crear rol' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'admin',
          description: 'Nombre del rol',
        },
      },
      required: ['name'],
    },
    description: 'Datos para crear un nuevo rol',
  })
  @ApiResponse({
    status: 201,
    description: 'Rol creado correctamente.',
    schema: {
      example: {
        id: 'uuid',
        createdDate: 1718040000,
        lastUpdateDate: 1718040000,
        version: 1,
        isActive: 1,
        name: 'admin',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'El rol ya existe o datos inválidos.',
  })
  async createRol(@Body('name') name: string) {
    const newRol = await this.usersService.createRol(name);
    return newRol;
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('/all/roles/')
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles.',
    schema: {
      example: [
        {
          id: 'uuid',
          createdDate: 1718040000,
          lastUpdateDate: 1718040000,
          version: 1,
          isActive: 1,
          name: 'admin',
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener los roles.',
  })
  async getAllRols() {
    try {
      return await this.usersService.getAllRols();
    } catch (error) {
      throw error;
    }
  }
}
