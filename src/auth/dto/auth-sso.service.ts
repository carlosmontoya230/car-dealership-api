import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/users.entity';
import { UsersService } from '../../users/users.service';
import { LoginDto } from './create-auth-sso.dto';

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
      const findUser = await this.usersService.findOne(email);

      if (!findUser) {
        throw new HttpException('USER_NOT_FOUND', 404);
      }

      const isPasswordValid = await compare(password, findUser.password);
      if (!isPasswordValid) {
        throw new HttpException('INVALID_PASSWORD', 403);
      }

      const roles = findUser.rolUsers.map((rolUser) => rolUser.rol.name);
      const payload = { email: findUser.email, sub: findUser.id, roles };
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

  async getUserByToken(token: string) {
    const secret = process.env.JWT_SECRET || 'defaultSecret';

    try {
      const decoded: any = this.jwtService.verify(token, { secret });

      const user = await this.userEntityRepository.findOne({
        where: { email: decoded.email },
        relations: ['rolUsers', 'rolUsers.rol'],
      });

      if (!user) {
        throw new BadRequestException('Usuario no encontrado.');
      }
      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Token expirado.');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Token inválido.');
      }
      throw new BadRequestException('Token inválido o expirado.');
    }
  }
}
