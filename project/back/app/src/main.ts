import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// eslint-disable-next-line no-var
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(6200);
}

bootstrap().then(() => console.log('Server started'));
