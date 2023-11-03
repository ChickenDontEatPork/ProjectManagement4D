import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentsAssignDto } from './dto/create-comments-assign.dto';
import { UpdateCommentsAssignDto } from './dto/update-comments-assign.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { CommentAssignments, Users } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { GetCommentAssignmentsDto } from './dto/get-assign-comment.dto';

@Injectable()
export class CommentsAssignService {
  constructor(private prismaService: PrismaService) {}
  async create(createCommentsAssignDto: CreateCommentsAssignDto, id: string) {
    try {
      const newComment = await this.prismaService.commentAssignments.create({
        data: {
          Users: { connect: { id: id } },
          Assigments: {
            connect: { id: createCommentsAssignDto.assignmentId },
          },
          description: createCommentsAssignDto.description,
        },
        include: { Users: true },
      });
      return plainToClass(GetCommentAssignmentsDto, newComment);
    } catch (err) {
      return err.response;
    }
  }

  async findAll(): Promise<CommentAssignments[]> {
    const comment = await this.prismaService.commentAssignments.findMany({
      include: { Assigments: true, Users: true },
    });
    return comment;
  }

  async findOne(id: string) {
    try {
      const comment = await this.prismaService.commentAssignments.findUnique({
        where: { id: id },
        include: {
          Assigments: true,
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
    updateCommentsAssignDto: UpdateCommentsAssignDto,
    userId: string,
  ) {
    try {
      const updatedComment = await this.prismaService.commentAssignments.update(
        {
          data: {
            Users: { connect: { id: userId } },
            Assigments: {
              connect: { id: updateCommentsAssignDto.assignmentId },
            },
            description: updateCommentsAssignDto.description,
          },
          where: {
            id: id,
          },
        },
      );
      return updatedComment;
    } catch (err) {
      return err.response;
    }
  }

  async remove(id: string, user: Users) {
    try {
      const comment = await this.prismaService.commentAssignments.findUnique({
        where: { id: id },
      });
      if (!comment) throw new NotFoundException();
      if (user.id != comment.userId) throw new ForbiddenException();
      await this.prismaService.commentAssignments.delete({
        where: { id: id },
      });
    } catch (err) {
      return err.response;
    }
  }
}
