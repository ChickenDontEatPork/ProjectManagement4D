import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { TagModule } from '@/tag/tag.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [PrismaModule, TagModule, UserModule],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
