import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserGroupService } from '@/user-group/user-group.service';
import { GroupService } from '@/group/group.service';
import { CreateGroupInviteDto } from './dto/create-group-invite.dto';
import { Users } from '@prisma/client';

@Injectable()
export class GroupInviteService {
  constructor(
    private prismaService: PrismaService,
    private userGroupService: UserGroupService,
    private groupService: GroupService,
  ) {}

  async genCode(groupId: string) {
    const today = new Date();
    const nextThreeDays = new Date(today.setDate(today.getDate() + 3));
    const genCode = await this.prismaService.groupInvites.create({
      data: {
        expire: nextThreeDays,
        Groups: {
          connect: {
            id: groupId,
          },
        },
      },
    });
    return genCode;
  }
  async generateInviteCode(userId: string, groupId: string) {
    const group = await this.groupService.findByGroupId(groupId);
    if (!group) throw new ForbiddenException();
    if (group.createBy != userId) throw new ForbiddenException();
    const code = await this.findCodeByGroupId(groupId);
    if (!code) {
      return await this.genCode(groupId);
    }
    const check = this.checkCodeIsExpire(code.expire);
    if (check) {
      await this.prismaService.groupInvites.delete({
        where: { id: code.id },
      });
      return await this.genCode(groupId);
    }
  }

  async findCodeByGroupId(groupId: string) {
    return await this.prismaService.groupInvites.findUnique({
      where: { groupId: groupId, status: true },
    });
  }

  checkCodeIsExpire(expireDate: Date): boolean {
    const today = new Date();
    if (today >= expireDate) {
      return true;
    } else {
      return false;
    }
  }

  async findByInviteCode(code: string) {
    const findCode = await this.prismaService.groupInvites.findUnique({
      where: { code: code, status: true },
    });
    return findCode;
  }

  async create(createGroupInviteDto: CreateGroupInviteDto, user: Users) {
    const code = await this.findByInviteCode(createGroupInviteDto.code);
    const check = this.checkCodeIsExpire(code.expire);
    const checkGroup = await this.prismaService.userGroups.findUnique({
      where: { userId: user.id },
    });
    const count = await this.prismaService.userGroups.aggregate({
      _count: { userId: true },
    });
    if (count._count.userId > 3) throw new ForbiddenException();
    if (checkGroup) throw new ConflictException();
    if (check) {
      this.prismaService.groupInvites.update({
        data: { status: false },
        where: { id: code.id },
      });
      throw new NotFoundException();
    }
    const group = await this.groupService.findByGroupId(code.groupId);
    return await this.userGroupService.create({
      userId: user.id,
      groupId: group.id,
    });
  }
}
