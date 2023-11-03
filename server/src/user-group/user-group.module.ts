import { Module } from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { UserGroupController } from './user-group.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserModule } from '@/user/user.module';
@Module({
  imports: [PrismaModule, UserModule],
  controllers: [UserGroupController],
  providers: [UserGroupService],
  exports: [UserGroupService],
})
export class UserGroupModule {}
