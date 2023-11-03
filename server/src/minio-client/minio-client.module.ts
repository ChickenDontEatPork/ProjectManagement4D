import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioClientController } from './minio-client.controller';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get<string>('minio.endpoint'),
        port: configService.get<number>('minio.port'),
        useSSL: false,
        accessKey: configService.get<string>('minio.accessKey'),
        secretKey: configService.get<string>('minio.secretKey'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MinioClientController],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
