import { Module } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { MinioClientModule } from '@/minio-client/minio-client.module';
import { TagModule } from '@/tag/tag.module';

@Module({
  imports: [PrismaModule, MinioClientModule, TagModule],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}
