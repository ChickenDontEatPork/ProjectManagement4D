import { Controller } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';

@Controller('minio-client')
export class MinioClientController {
  constructor(private readonly minioClientService: MinioClientService) {}
}
