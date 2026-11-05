import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));

    const config = new DocumentBuilder()
        .setTitle('Microservicio de Pedidos')
        .setDescription('Gestion de pedidos y compras')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    const puerto = process.env.PORT ?? 3003;
    await app.listen(puerto, '0.0.0.0');
    console.log(`Microservicio de pedidos escuchando en el puerto ${puerto}`)
    console.log(`Documentacion swagger disponible en http://localhost:${puerto}/docs`)
}

await bootstrap();
