import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { MinioClientModule } from '@/minio-client/minio-client.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [MinioClientModule, PrismaModule],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
