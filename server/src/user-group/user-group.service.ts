import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UserGroups } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class UserGroupService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}
  async create(createUserGroupDto: CreateUserGroupDto) {
    try {
      const user = await this.userService.findOne(createUserGroupDto.userId);
      if (!user) throw new NotFoundException();
      const userGroup = await this.findUserGroupByUser(
        createUserGroupDto.userId,
      );
      if (userGroup) throw new ConflictException();
      const createUserGroup = await this.prismaService.userGroups.create({
        data: {
          Groups: {
            connect: {
              id: createUserGroupDto.groupId,
            },
          },
          Users: {
            connect: {
              id: createUserGroupDto.userId,
            },
          },
        },
      });
      return createUserGroup;
    } catch (err) {
      return err.response;
    }
  }

  async findAll(): Promise<UserGroups[]> {
    return await this.prismaService.userGroups.findMany({
      include: { Groups: { include: { Topics: true } }, Users: true },
    });
  }

  async findOne(id: string) {
    try {
      const userGroup = await this.prismaService.userGroups.findUnique({
        where: { id: id },
        include: { Groups: { include: { Topics: true } }, Users: true },
      });
      if (!userGroup) throw new NotFoundException();
      return userGroup;
    } catch (err) {
      return err.response;
    }
  }

  async findUserGroupByUser(userId: string) {
    try {
      const userGroup = await this.prismaService.userGroups.findUnique({
        where: { userId: userId },
        include: { Groups: { include: { Topics: true } }, Users: true },
      });
      return userGroup;
    } catch (err) {
      return err.response;
    }
  }
  async remove(userId: string) {
    try {
      await this.prismaService.userGroups.delete({ where: { userId: userId } });
    } catch (err) {
      return err.response;
    }
  }
}
