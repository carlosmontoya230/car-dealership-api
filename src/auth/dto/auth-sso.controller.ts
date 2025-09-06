import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthSsoService } from './auth-sso.service';
import { LoginDto } from './create-auth-sso.dto';

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
      console.log(
        '🚀 ~ AuthSsoController ~ authenticator ~ userAuth:',
        userAuth,
      );
      res.status(200).json(userAuth);
    } catch (error) {
      const errorMessage = error.message || 'Error desconocido';
      res.status(error.status || 500).json({ message: errorMessage });
    }
  }
}
