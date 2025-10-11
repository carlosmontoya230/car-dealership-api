import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginDto } from './create-auth-sso.dto';
import { UsersService } from '../../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/users.entity';

@Injectable()
export class AuthSsoService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async auth(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const findUser = await this.userEntityRepository.findOne({
        where: { email },
      });

      if (!findUser) {
        throw new HttpException('USER_NOT_FOUND', 404);
      }

      const isPasswordValid = await compare(password, findUser.password);
      if (!isPasswordValid) {
        throw new HttpException('INVALID_PASSWORD', 403);
      }

      const rol = findUser.rolUsers.map((rolUser) => rolUser.rol.name);
      const payload = { email: findUser.email, sub: findUser.id, rol };
      const token = this.jwtService.sign(payload);

      return {
        statusCode: 200,
        user: findUser.email,
        token,
      };
    } catch (error) {
      throw error;
    }
  }
}
