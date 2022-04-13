import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<express.NestExpressApplication>(AppModule/*, {
    logger: ['error', 'warn']
  }*/);

  const config = new DocumentBuilder()
    .setTitle('Weather App')
    .setDescription('The assessment is to make an API that is able to get the weather information for certain cities.')
    .setVersion('1.0')
    .addTag('weather')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}
bootstrap();
