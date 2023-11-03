import { MinioClientService } from '@/minio-client/minio-client.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAssignmentSubmitDto } from './dto/create-assignmentSubmit.dto';
import { Users } from '@prisma/client';
import { BufferedFile } from '@/minio-client/model/file.model';
import { UpdateProtorDto } from './dto/update-proctor.dto';
import { AssignmentStatus } from '@/shared/enums/status.enum';

@Injectable()
export class AssignmentSubmitService {
  constructor(
    private minioService: MinioClientService,
    private prismaService: PrismaService,
  ) {}

  async updateByProctor(id: string, updateProtorDto: UpdateProtorDto) {
    try {
      const assignmentSubmit =
        await this.prismaService.assignmentSubmit.findUnique({
          where: { id: id },
        });
      if (assignmentSubmit.status != 'APPROVE_ADVISOR')
        throw new ForbiddenException();
      if (updateProtorDto.status == AssignmentStatus.APPROVE_PROCTOR) {
        const submit = await this.prismaService.assignmentSubmit.update({
          data: { status: 'APPROVE_PROCTOR' },
          where: { id: id },
        });
        return submit;
      } else if (updateProtorDto.status == AssignmentStatus.REJECT_PROCTOR) {
        const submit = await this.prismaService.assignmentSubmit.update({
          data: { status: 'REJECT_PROCTOR' },
          where: { id: id },
        });
        return submit;
      }
      throw new ForbiddenException();
    } catch (err) {
      return err.response;
    }
  }

  async updateByAdvisor(id: string, updateProtorDto: UpdateProtorDto) {
    try {
      const assignmentSubmit =
        await this.prismaService.assignmentSubmit.findUnique({
          where: { id: id },
        });
      if (assignmentSubmit.status != 'SEND') throw new ForbiddenException();
      if (updateProtorDto.status == AssignmentStatus.APPROVE_ADVISOR) {
        const submit = await this.prismaService.assignmentSubmit.update({
          data: { status: 'APPROVE_ADVISOR' },
          where: { id: id },
        });
        return submit;
      } else if (updateProtorDto.status == AssignmentStatus.REJECT_ADVISOR) {
        const submit = await this.prismaService.assignmentSubmit.update({
          data: { status: 'REJECT_ADVISOR' },
          where: { id: id },
        });
        return submit;
      }
      throw new ForbiddenException();
    } catch (err) {
      return err.response;
    }
  }

  async deleteImage(id: string, user: Users) {
    try {
      const image = await this.prismaService.assignmentSubmitFiles.findUnique({
        where: { id: id },
        include: { AssignmentSubmit: { include: { Assignments: true } } },
      });
      if (!image) throw new NotFoundException();
      const group = await this.prismaService.userGroups.findUnique({
        where: {
          userId: user.id,
          groupId: image.AssignmentSubmit.groupId,
        },
      });
      if (!group) throw new ForbiddenException();
      await this.minioService.delete(image.name, 'submit');
      await this.prismaService.assignmentSubmitFiles.delete({
        where: { id: id },
      });
    } catch (err) {
      return err.response;
    }
  }

  async findById(id: string) {
    try {
      const assignmentSubmit =
        await this.prismaService.assignmentSubmit.findUnique({
          where: { id: id },
          include: { Assignments: true },
        });
      if (!assignmentSubmit) throw new NotFoundException();
      return assignmentSubmit;
    } catch (err) {
      return err.response;
    }
  }

  async cancleAssignment(id: string, user: Users) {
    try {
      const assignment = await this.prismaService.assignmentSubmit.findUnique({
        where: { id: id },
        include: { Assignments: true },
      });
      if (!assignment) throw new NotFoundException();
      const userGroup = await this.prismaService.userGroups.findUnique({
        where: { userId: user.id },
      });
      if (!userGroup) throw new NotFoundException();
      if (assignment.status !== 'SEND') throw new ForbiddenException();
      return await this.prismaService.assignmentSubmit.update({
        data: { status: 'NOTSEND' },
        where: { id: id },
      });
    } catch (err) {
      return err.response;
    }
  }

  async createWithFile(
    files: BufferedFile[],
    createAssignmentSubmit: CreateAssignmentSubmitDto,
    user: Users,
  ) {
    try {
      if (files.length > 5) throw new UnprocessableEntityException();

      const assignment = await this.prismaService.assignments.findUnique({
        where: { id: createAssignmentSubmit.assignmentId },
      });
      if (!assignment) throw new NotFoundException();
      const userGroup = await this.prismaService.userGroups.findUnique({
        where: { userId: user.id },
      });
      if (!userGroup) throw new ForbiddenException();
      const assignCheck = await this.prismaService.assignmentSubmit.findUnique({
        where: {
          assignmentId: createAssignmentSubmit.assignmentId,
          groupId: userGroup.groupId,
        },
      });
      if (assignCheck) throw new ConflictException();
      const assignmentSubmit = await this.prismaService.assignmentSubmit.create(
        {
          data: {
            assignmentId: createAssignmentSubmit.assignmentId,
            groupId: userGroup.groupId,
            status: 'SEND',
          },
          include: { Assignments: true },
        },
      );
      const uploads = await Promise.all(
        files.map(async (file) => {
          const upload = await this.minioService.upload(file, 'submit');
          return upload;
        }),
      );
      const uploadFileData = await Promise.all(
        uploads.map(async (up) => {
          return {
            name: up.filename,
            bucket: up.bucketName,
            assignmentSubmitId: assignmentSubmit.id,
          };
        }),
      );
      await this.prismaService.assignmentSubmitFiles.createMany({
        data: uploadFileData,
      });
      return assignmentSubmit;
    } catch (err) {
      return err.response;
    }
  }

  checkCodeIsExpire(expireDate: Date): boolean {
    const today = new Date();
    if (today >= expireDate) {
      return true;
    } else {
      return false;
    }
  }

  async create(createAssignmentSubmit: CreateAssignmentSubmitDto, user: Users) {
    try {
      const assignment = await this.prismaService.assignments.findUnique({
        where: { id: createAssignmentSubmit.assignmentId },
      });
      if (!assignment) throw new NotFoundException();
      const userGroup = await this.prismaService.userGroups.findUnique({
        where: { userId: user.id },
      });
      if (!userGroup) throw new ForbiddenException();
      const assignCheck = await this.prismaService.assignmentSubmit.findUnique({
        where: {
          assignmentId: createAssignmentSubmit.assignmentId,
          groupId: userGroup.groupId,
        },
      });
      if (assignCheck) throw new ConflictException();
      const check = this.checkCodeIsExpire(assignment.dueAt);
      if (check) {
        const assignmentSubmit =
          await this.prismaService.assignmentSubmit.create({
            data: {
              Assignments: {
                connect: { id: createAssignmentSubmit.assignmentId },
              },
              status: 'TURNINLATE',
              Groups: { connect: { id: userGroup.groupId } },
            },
            include: { Assignments: true },
          });
        return assignmentSubmit;
      } else {
        const assignmentSubmit =
          await this.prismaService.assignmentSubmit.create({
            data: {
              Assignments: {
                connect: { id: createAssignmentSubmit.assignmentId },
              },
              status: 'SEND',
              Groups: { connect: { id: userGroup.groupId } },
            },
            include: { Assignments: true },
          });
        return assignmentSubmit;
      }
    } catch (err) {
      return err.response;
    }
  }
}
