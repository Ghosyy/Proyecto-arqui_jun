// modulo principal de pedidos
// conexion typeorm a supabase con el esquema pedidos
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PedidosModule } from './pedidos/pedidos.module.js';

@Module({
    imports: [
        // variables de entorno
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
                        schema: configService.get<string>('DB_SCHEMA', 'pedidos'),
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
                    schema: configService.get<string>('DB_SCHEMA', 'pedidos'),
                    autoLoadEntities: true,
                    synchronize: false,
                    ssl: configService.get<string>('DB_HOST') !== 'localhost'
                        ? { rejectUnauthorized: false }
                        : false,
                };
            },
        }),
        PedidosModule,
    ],
})
export class AppModule {}
