import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Query,
  BadRequestException,
  Headers,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthSsoService } from './auth-sso.service';
import { LoginDto } from './create-auth-sso.dto';
import { UserEntity } from '../../users/entities/users.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/rolDecorator.service';
import { RolesGuard } from '../../common/guards/rolesguard.service';

@ApiTags('auth-sso')
@Controller('auth-sso')
export class AuthSsoController {
  constructor(private readonly authSsoService: AuthSsoService) {}

  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado correctamente.',
  })
  @Post('login')
  async authenticator(@Body() loginDto: LoginDto, @Res() res) {
    try {
      const userAuth = await this.authSsoService.auth(loginDto);
      res.status(200).json(userAuth);
    } catch (error) {
      const errorMessage = error.message || 'Error desconocido';
      res.status(error.status || 500).json({ message: errorMessage });
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('user-by-token')
  @ApiOperation({ summary: 'Obtener usuario a partir de un token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: UserEntity,
  })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async getUserByToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new BadRequestException('El header Authorization es requerido.');
    }
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) {
      throw new BadRequestException('Token no encontrado en el header.');
    }
    return await this.authSsoService.getUserByToken(token);
  }
}
