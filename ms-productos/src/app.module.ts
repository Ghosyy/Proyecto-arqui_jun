import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductosModule } from './productos/productos.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const databaseUrl = configService.get<string>('DATABASE_URL');
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
