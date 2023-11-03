import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GroupInviteService } from './group-invite.service';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { CreateGroupInviteDto } from './dto/create-group-invite.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('group-invite')
@UseGuards(JwtGuard)
@Controller('group-invite')
export class GroupInviteController {
  constructor(private readonly groupInviteService: GroupInviteService) {}

  @Post('generate/code/:groupId')
  async generateInviteCode(
    @GetUser() user: Users,
    @Param('groupId') groupId: string,
  ) {
    return await this.groupInviteService.generateInviteCode(user.id, groupId);
  }

  @Post('')
  async inviteUser(
    @Body() createGroupInviteDto: CreateGroupInviteDto,
    @GetUser() user: Users,
  ) {
    return await this.groupInviteService.create(createGroupInviteDto, user);
  }
}
