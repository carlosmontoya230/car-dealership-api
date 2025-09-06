import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './create-auth-sso.dto';

@Injectable()
export class AuthSsoService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async auth(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const findUser = this.usersService.usersData.find(
        (user) => user.email === email,
      );
      if (!findUser) {
        throw new HttpException('USER_NOT_FOUND', 404);
      }

      // const isPasswordValid = await compare(password, findUser.password);
      const isPasswordValid = password === findUser.password;
      if (!isPasswordValid) {
        throw new HttpException('INVALID_PASSWORD', 403);
      }

      const payload = {
        email: findUser.email,
        roles: [],
      };

      const token = this.jwtService.sign(payload);

      return {
        statusCode: 200,
        user: payload,
        token,
      };
    } catch (error) {
      throw error;
    }
  }
}
