import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'clave123',
    description: 'contraseña del usuario',
  })
  @IsString()
  password: string;

  @ApiProperty({ example: '+1234567890', description: 'Teléfono del usuario' })
  @IsString()
  phone: string;

  // @ApiProperty({
  //   example: ['admin', 'user'],
  //   description: 'Lista de roles del usuario',
  //   isArray: true,
  //   required: false,
  // })
  // @IsOptional()
  // @IsString({ each: true })
  // rolUsers?: string[];

  @ApiProperty({
    example: 'Calle 123, Ciudad',
    description: 'Dirección del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: ['admin', 'user'],
    description: 'Lista de roles del usuario',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  rolUsers?: string[];
}
