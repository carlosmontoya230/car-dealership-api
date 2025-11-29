import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { Roles } from '../../common/decorators/rolDecorator.service';
import { RolesGuard } from '../../common/guards/rolesguard.service';
import { UserEntity } from '../../users/entities/users.entity';
import { UsersService } from '../../users/users.service';
import { SmsService } from '../sms/sms.service';
import { AuthSsoService } from './auth-sso.service';
import { LoginDto } from './create-auth-sso.dto';

@ApiTags('auth-sso')
@Controller('auth-sso')
export class AuthSsoController {
  constructor(
    private readonly authSsoService: AuthSsoService,
    private readonly smsService: SmsService,
    private usersService: UsersService,
  ) {}

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

  //* reset password *//
  @ApiOperation({ summary: 'Limpiar código de verificación por email' })
  @ApiResponse({ status: 200, description: 'Código de verificación limpiado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @Post('clear-verification-code-by-email')
  async clearVerificationCodeByEmail(@Query('email') email: string) {
    return await this.usersService.clearVerificationCodeByEmail(email);
  }

  @ApiOperation({ summary: 'Cambiar contraseña por email' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @Post('change-password')
  async changePassword(
    @Query('email') email: string,
    @Query('newPassword') newPassword: string,
  ) {
    return await this.usersService.changePassword(email, newPassword);
  }

  //* Password recovery via SMS *//
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña por email' })
  @ApiResponse({
    status: 200,
    description: 'Código enviado al teléfono del usuario.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @Post('request-password-recovery')
  async requestPasswordRecovery(@Query('email') email: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user || !user.phone) {
      throw new BadRequestException(
        'Usuario no encontrado o sin teléfono registrado.',
      );
    }
    const code = randomInt(100000, 999999).toString();
    await this.usersService.saveVerificationCode(user.phone, code);
    await this.smsService.sendVerificationCode(user.phone, code);
    return { message: 'Código enviado al teléfono registrado.' };
  }

  @ApiOperation({ summary: 'Validar código de verificación por email' })
  @ApiResponse({ status: 200, description: 'Código validado correctamente.' })
  @ApiResponse({ status: 400, description: 'Código inválido o expirado.' })
  @Post('validate-code')
  async validateCode(
    @Query('email') email: string,
    @Query('code') code: string,
  ) {
    return await this.usersService.verifyCodeByEmail(email, code);
  }
}
