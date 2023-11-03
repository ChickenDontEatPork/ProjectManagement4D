import { Module } from '@nestjs/common';
import { GroupInviteService } from './group-invite.service';
import { GroupInviteController } from './group-invite.controller';
import { UserGroupModule } from '@/user-group/user-group.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { GroupModule } from '@/group/group.module';

@Module({
  imports: [UserGroupModule, PrismaModule, GroupModule],
  controllers: [GroupInviteController],
  providers: [GroupInviteService],
  exports: [GroupInviteService],
})
export class GroupInviteModule {}
