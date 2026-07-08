import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: ['http://localhost:5173', 'https://artigo-front.vercel.app'],
    credentials: true,
  });

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('Artigo Api - Plataforma de artigos')
    .addBearerAuth()
    .setDescription('Api para uso da plataforma Artigos')
    .setVersion('1')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
