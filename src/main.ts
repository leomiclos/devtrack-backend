import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa o CORS para permitir requisições de qualquer URL
  app.enableCors({
    origin: true,
  });

  app.use(morgan('dev'));
  
  // Ativa a validação global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,  // Temporariamente desativado
  }));  

  await app.listen(3000);
}
bootstrap();
