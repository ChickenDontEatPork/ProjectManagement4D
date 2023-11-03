import { Module } from '@nestjs/common';
import { CommentsAnnounceService } from './comments-announce.service';
import { CommentsAnnounceController } from './comments-announce.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommentsAnnounceController],
  providers: [CommentsAnnounceService],
})
export class CommentsAnnounceModule {}
