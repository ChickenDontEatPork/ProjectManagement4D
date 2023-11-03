import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tags } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prismaService: PrismaService) {}
  async create(createTagDto: CreateTagDto) {
    try {
      const tag = await this.prismaService.tags.create({ data: createTagDto });
      return tag;
    } catch (err) {
      return err.response;
    }
  }

  async findAll(): Promise<Tags[]> {
    return await this.prismaService.tags.findMany();
  }

  async findOne(id: string): Promise<Tags> {
    try {
      const tag = await this.prismaService.tags.findUnique({
        where: { id: id },
      });
      if (!tag) throw new NotFoundException();
      return tag;
    } catch (err) {
      return err.response;
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const tag = await this.findOne(id);
      if (!tag) throw new NotFoundException();
      tag.name = updateTagDto.name;
      const updateTag = await this.prismaService.tags.update({
        data: tag,
        where: { id: id },
      });
      return updateTag;
    } catch (err) {
      return err.response;
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.tags.delete({ where: { id: id } });
    } catch (err) {
      return err.response;
    }
  }
}
