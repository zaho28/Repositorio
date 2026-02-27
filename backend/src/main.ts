import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Fix BigInt serialization
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  await app.listen(3000);
}
bootstrap();
