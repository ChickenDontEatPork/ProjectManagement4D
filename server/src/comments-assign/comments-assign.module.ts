import { Module } from '@nestjs/common';
import { CommentsAssignService } from './comments-assign.service';
import { CommentsAssignController } from './comments-assign.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommentsAssignController],
  providers: [CommentsAssignService],
})
export class CommentsAssignModule {}
