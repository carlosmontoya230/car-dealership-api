import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import SwaggerUI from 'swagger-ui-express';

import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api/v1');

  // Configuración de Swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('API car dealership')
    .setDescription(
      'Documentación de la API para la gestión de un concesionario',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT aquí',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/v1/carsDealership/doc', app, document);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.getOrThrow('PORT', process.env.APP_PORT || 3000);
  await app.listen(port);

  Logger.log(`🚀 Documentación iniciado host api/v1/indicators/doc`);
  Logger.log(`🚀 Servidor iniciado en el puerto ${process.env.APP_PORT}`);
  Logger.log(
    `🚀 Conexión exitosa ${process.env.ENVIRONMENT} ${process.env.DB_DATABASE}: ${process.env.DB_TYPE}`,
  );
}
bootstrap();
