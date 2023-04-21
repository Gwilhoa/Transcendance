import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const reflector = app.get(Reflector);
	app.enableCors({
		origin: '*',
	});
	await app.init();
	await app.listen(3000);
}

bootstrap();