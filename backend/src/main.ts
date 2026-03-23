import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // archivos estáticos desde la carpeta "uploads"
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Accede a las imágenes con /uploads/filename.jpg
  });

  // Habilita CORS para permitir solicitudes desde el frontend (Vite/React)
  app.enableCors({
    origin: 'http://localhost:5173', // puerto de Vite/React
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Productos')
    .setDescription('API para gestionar productos, categorías y clasificaciones')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    explorer: true, // Habilita el explorador de rutas
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token JWT en Swagger UI
      filtrer: true, // Habilita el filtrado de rutas
      showRequestDuration: true, // Muestra la duración de las solicitudes
    },
  });
  
  // Fix BigInt serialization
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Transforma los datos entrantes a los tipos definidos en los DTOs
    whitelist: true, // Elimina propiedades no definidas en los DTOs
  }));

  await app.listen(3000);
}
bootstrap();
