import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthSsoModule } from './auth/dto/auth-sso.module';
import { CarsModule } from './cars/cars.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate:
          process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true,
      },
      logging: true,
      synchronize: true,
      entities: [],
    }),
    MaintenanceModule,
    CarsModule,
    UsersModule,
    AuthSsoModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
