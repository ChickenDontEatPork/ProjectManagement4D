import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Groups, Users } from '@prisma/client';
import { UpdateGroupDto } from './dto/update-group.dto';
import { plainToClass } from 'class-transformer';
import { GetGroupDto } from './dto/get-group.dto';
@Injectable()
export class GroupService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}
  async findAll(page: number = 1, perPage: number = 5) {
    try {
      const skip = page > 0 ? perPage * (page - 1) : 0;
      const count = await this.prismaService.groups.aggregate({
        _count: { id: true },
      });
      const groups = await this.prismaService.groups.findMany({
        skip: skip,
        take: perPage,
        include: {
          Topics: true,
          UserGroups: { include: { Users: true } },
        },
      });
      const getDto = plainToClass(GetGroupDto, groups, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
      const total = getDto.length;
      const lastPage = Math.ceil(count._count.id / perPage);
      return {
        data: getDto,
        meta: {
          total,
          lastPage,
          currentPage: page,
          perPage,
          prev: page > 1 ? page - 1 : null,
          next: page < lastPage ? page + 1 : null,
        },
      };
    } catch (err) {
      return err.response;
    }
  }

  async findAllSearch(
    page: number = 1,
    search: string = '',
    perPage: number = 5,
  ) {
    try {
      const skip = page > 0 ? perPage * (page - 1) : 0;
      const groups = await this.prismaService.groups.findMany({
        where: { Topics: { name: { contains: search } } },
        skip: skip,
        take: perPage,
        include: {
          Topics: true,
          UserGroups: { include: { Users: true } },
        },
      });
      const getDto = plainToClass(GetGroupDto, groups, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
      const total = getDto.length;
      const lastPage = Math.ceil(total / perPage);
      return {
        data: getDto,
        meta: {
          total,
          lastPage,
          currentPage: page,
          perPage,
          prev: page > 1 ? page - 1 : null,
          next: page < lastPage ? page + 1 : null,
        },
      };
    } catch (err) {
      return err.response;
    }
  }

  async findByGroupId(groupId: string): Promise<Groups> {
    try {
      const group = await this.prismaService.groups.findUnique({
        where: { id: groupId },
        include: {
          Users: true,
          Topics: true,
        },
      });
      if (!group) throw new NotFoundException();
      return group;
    } catch (err) {
      return err.response;
    }
  }
  async findOne(id: string): Promise<Groups> {
    try {
      const group = await this.prismaService.groups.findUnique({
        where: { id: id },
        include: {
          Users: true,
          Topics: true,
        },
      });
      if (!group) throw new NotFoundException();
      return group;
    } catch (err) {
      return err.response;
    }
  }
  async create(createGroupDto: CreateGroupDto, users: Users): Promise<Groups> {
    try {
      const user = await this.prismaService.groups.findUnique({
        where: { createBy: users.id },
      });
      if (user) throw new ConflictException();
      const group = await this.prismaService.groups.create({
        data: {
          Topics: {
            connect: {
              id: createGroupDto.topicId,
            },
          },
          Users: {
            connect: {
              id: users.id,
            },
          },
        },
      });
      await this.prismaService.userGroups.create({
        data: {
          groupId: group.id,
          userId: group.createBy,
        },
      });
      return group;
    } catch (err) {
      return err.response;
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Groups> {
    try {
      const group = await this.findOne(id);
      if (!group) throw new NotFoundException();
      const updateGroup = await this.prismaService.groups.update({
        where: {
          id: id,
        },
        data: {
          Topics: { connect: { id: updateGroupDto.topicId } },
        },
      });
      return updateGroup;
    } catch (err) {
      return err.response;
    }
  }
  async remove(id: string) {
    try {
      await this.prismaService.groups.delete({ where: { id: id } });
    } catch (err) {
      return err.response;
    }
  }
}
