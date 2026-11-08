// punto de arranque del microservicio de productos
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // pipes de validacion global como en el proyecto de helados
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));

    // configuracion de swagger
    const config = new DocumentBuilder()
        .setTitle('Microservicio de Productos')
        .setDescription('Catalogo de productos y stock')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    // puerto por variable de entorno o por defecto 3001
    const puerto = process.env.PORT ?? 3001;
    await app.listen(puerto, '0.0.0.0');
    console.log(`Microservicio de productos escuchando en el puerto ${puerto}`)
    console.log(`Documentacion swagger disponible en http://localhost:${puerto}/docs`)
}

await bootstrap();
