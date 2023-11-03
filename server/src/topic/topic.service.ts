import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Topics } from '@prisma/client';
import { TagService } from '@/tag/tag.service';
import { UserService } from '@/user/user.service';
import { plainToClass } from 'class-transformer';
import { GetTopicDto } from './dto/get-topic.dto';

@Injectable()
export class TopicService {
  constructor(
    private prismaService: PrismaService,
    private tagService: TagService,
    private userService: UserService,
  ) {}
  async create(createTopicDto: CreateTopicDto) {
    try {
      let priority: number = 0;

      const tag = await this.tagService.findOne(createTopicDto.tagId);

      const users = await Promise.all(
        createTopicDto.advisorId.map(async (d) => {
          const user = await this.userService.findAdvisor(d);
          if (!user) throw new NotFoundException();
          return {
            Users: { connect: { id: user.id } },
            priority: (priority += 1),
          };
        }),
      );

      if (!tag) throw new NotFoundException();

      const newTopic = await this.prismaService.topics.create({
        data: {
          name: createTopicDto.name,
          description: createTopicDto.description,
          tagId: tag.id,
          AdvisorTopic: {
            create: users,
          },
        },
        include: { AdvisorTopic: true },
      });
      return newTopic;
    } catch (err) {
      return err.response;
    }
  }

  async findAll(page: number = 1, size: number = 10): Promise<Topics[]> {
    return await this.prismaService.topics.findMany({
      skip: (page - 1) * size,
      take: size,
      include: {
        AdvisorTopic: {
          include: { Users: true },
        },
        Tags: true,
        Groups: {
          include: { UserGroups: { include: { Users: true } } },
        },
      },
    });
  }

  async findOne(id: string): Promise<GetTopicDto> {
    try {
      const topic = await this.prismaService.topics.findUnique({
        where: { id: id },
        include: {
          AdvisorTopic: {
            include: { Users: true },
          },
          Tags: true,
          Groups: {
            include: { UserGroups: { include: { Users: true } } },
          },
        },
      });
      if (!topic) throw new NotFoundException();
      const getDto = plainToClass(GetTopicDto, topic, {
        excludeExtraneousValues: true,
      });

      return getDto;
    } catch (err) {
      return err.response;
    }
  }

  async update(id: string, updateTopicDto: UpdateTopicDto) {
    try {
      let priority: number = 0;
      const tag = await this.tagService.findOne(updateTopicDto.tagId);

      if (!tag) throw new NotFoundException();
      const users = await Promise.all(
        updateTopicDto.advisorId.map(async (d) => {
          const user = await this.userService.findAdvisor(d);
          if (!user) throw new NotFoundException();
          return {
            Users: { connect: { id: user.id } },
            priority: (priority += 1),
          };
        }),
      );
      const updateTopic = await this.prismaService.topics.update({
        data: {
          name: updateTopicDto.name,
          description: updateTopicDto.description,
          tagId: tag.id,
          AdvisorTopic: {
            deleteMany: {},
            create: users,
          },
        },
        where: {
          id: id,
        },
      });
      return updateTopic;
    } catch (err) {
      return err.response;
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.topics.delete({ where: { id: id } });
    } catch (err) {
      return err.response;
    }
  }
}
