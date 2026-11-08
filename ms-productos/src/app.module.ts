// modulo principal de productos
// agarre la misma logica de configuracion de typeorm y la adapte a postgresql
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductosModule } from './productos/productos.module.js';

@Module({
    imports: [
        // variables de entorno globales
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const databaseUrl = configService.get<string>('DATABASE_URL');
                // conexion por url para supabase y render
                if (databaseUrl) {
                    return {
                        type: 'postgres',
                        url: databaseUrl,
                        schema: configService.get<string>('DB_SCHEMA', 'productos'),
                        autoLoadEntities: true,
                        synchronize: false,
                        ssl: { rejectUnauthorized: false },
                    };
                }

                // conexion por parametros individuales en local
                return {
                    type: 'postgres',
                    host: configService.get<string>('DB_HOST', 'localhost'),
                    port: configService.get<number>('DB_PORT', 5432),
                    username: configService.get<string>('DB_USERNAME', 'postgres'),
                    password: configService.get<string>('DB_PASSWORD', ''),
                    database: configService.get<string>('DB_NAME', 'postgres'),
                    schema: configService.get<string>('DB_SCHEMA', 'productos'),
                    autoLoadEntities: true,
                    synchronize: false,
                    ssl: configService.get<string>('DB_HOST') !== 'localhost'
                        ? { rejectUnauthorized: false }
                        : false,
                };
            },
        }),
        ProductosModule,
    ],
})
export class AppModule {}
