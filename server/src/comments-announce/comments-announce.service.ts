import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentsAnnounceDto } from './dto/create-comments-announce.dto';
import { UpdateCommentsAnnounceDto } from './dto/update-comments-announce.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { CommentAnnoucements, Users } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { GetCommentDto } from './dto/get-comments.dto';
@Injectable()
export class CommentsAnnounceService {
  constructor(private prismaService: PrismaService) {}
  async create(
    createCommentsAnnounceDto: CreateCommentsAnnounceDto,
    id: string,
  ) {
    try {
      const announce = await this.prismaService.announcements.findUnique({
        where: { id: createCommentsAnnounceDto.annoucementId },
      });
      if (!announce) throw new NotFoundException();
      const newComment = await this.prismaService.commentAnnoucements.create({
        data: {
          userId: id,
          annoucementId: createCommentsAnnounceDto.annoucementId,
          description: createCommentsAnnounceDto.description,
        },
        include: { Users: true },
      });
      return plainToClass(GetCommentDto, newComment);
    } catch (err) {
      return err.response;
    }
  }

  async findAll(): Promise<CommentAnnoucements[]> {
    const comment = await this.prismaService.commentAnnoucements.findMany({
      include: { Annoucements: true, Users: true },
    });
    return comment;
  }

  async findOne(id: string) {
    try {
      const comment = await this.prismaService.commentAnnoucements.findUnique({
        where: { id: id },
        include: {
          Annoucements: true,
          Users: true,
        },
      });
      if (!comment) throw new NotFoundException();
      return comment;
    } catch (err) {
      return err.response;
    }
  }

  async update(
    id: string,
    updateCommentsAnnounceDto: UpdateCommentsAnnounceDto,
  ) {
    try {
      const updatedComment =
        await this.prismaService.commentAnnoucements.update({
          data: {
            description: updateCommentsAnnounceDto.description,
          },
          where: {
            id: id,
          },
        });
      return updatedComment;
    } catch (err) {
      return err.response;
    }
  }

  async remove(id: string, user: Users) {
    try {
      const comment = await this.prismaService.commentAnnoucements.findUnique({
        where: { id: id },
      });
      if (!comment) throw new NotFoundException();
      if (user.id != comment.userId) throw new ForbiddenException();
      await this.prismaService.commentAnnoucements.delete({
        where: { id: id },
      });
    } catch (err) {
      return err.response;
    }
  }
}
