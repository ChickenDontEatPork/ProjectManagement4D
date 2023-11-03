import { MinioClientService } from '@/minio-client/minio-client.service';
import { BufferedFile } from '@/minio-client/model/file.model';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Users } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { PaginatedResult } from '@/shared/interfaces/paginate.interface';
import { GetAssignmentDto } from './dto/get-assignment.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AssignmentService {
  constructor(
    private minioService: MinioClientService,
    private prismaService: PrismaService,
  ) {}

  async createWithFile(
    files: BufferedFile[],
    createAssignmentDto: CreateAssignmentDto,
    user: Users,
  ) {
    try {
      const today = new Date();
      if (today >= createAssignmentDto.dueAt) throw new BadRequestException();
      if (files.length > 5) throw new UnprocessableEntityException();
      if (typeof createAssignmentDto.groupId == 'undefined') {
        const groups = await this.prismaService.groups.findMany();
        if (groups.length < 1) throw new NotFoundException();
        const groupIds = await Promise.all(
          groups.map(async (group) => {
            return { groupId: group.id };
          }),
        );
        const assignment = await this.prismaService.assignments.create({
          data: {
            title: createAssignmentDto.title,
            description: createAssignmentDto.description,
            dueAt: createAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              createMany: { data: groupIds },
            },
          },
        });
        if (assignment) {
          const uploads = await this.uploadImage(files);
          await Promise.all(
            uploads.map(async (upload) => {
              return await this.prismaService.assignmentFiles.create({
                data: {
                  bucket: upload.bucketName,
                  name: upload.filename,
                  Assignments: { connect: { id: assignment.id } },
                },
              });
            }),
          );
          return assignment;
        }
        throw new BadRequestException();
      } else if (typeof createAssignmentDto.groupId == 'string') {
        const group = await this.prismaService.groups.findUnique({
          where: { id: createAssignmentDto.groupId },
        });
        if (!group) throw new NotFoundException();
        const assignment = await this.prismaService.assignments.create({
          data: {
            title: createAssignmentDto.title,
            description: createAssignmentDto.description,
            dueAt: createAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              create: { groupId: group.id },
            },
          },
        });
        if (assignment) {
          const uploads = await this.uploadImage(files);
          await Promise.all(
            uploads.map(async (upload) => {
              return await this.prismaService.assignmentFiles.create({
                data: {
                  bucket: upload.bucketName,
                  name: upload.filename,
                  Assignments: { connect: { id: assignment.id } },
                },
              });
            }),
          );
          return assignment;
        }
        throw new BadRequestException();
      } else if (typeof createAssignmentDto.groupId == 'object') {
        const groups = await Promise.all(
          createAssignmentDto.groupId.map(async (assign) => {
            const query = await this.prismaService.groups.findUnique({
              where: { id: assign },
            });
            if (!query) throw new NotFoundException();
            return query;
          }),
        );
        if (groups.length < 1) throw new NotFoundException();
        const groupIds = await Promise.all(
          groups.map(async (group) => {
            return { groupId: group.id };
          }),
        );
        const assignment = await this.prismaService.assignments.create({
          data: {
            title: createAssignmentDto.title,
            description: createAssignmentDto.description,
            dueAt: createAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              createMany: { data: groupIds },
            },
          },
        });
        if (assignment) {
          const uploads = await this.uploadImage(files);
          await Promise.all(
            uploads.map(async (upload) => {
              return await this.prismaService.assignmentFiles.create({
                data: {
                  bucket: upload.bucketName,
                  name: upload.filename,
                  Assignments: { connect: { id: assignment.id } },
                },
              });
            }),
          );
          return assignment;
        }
        throw new BadRequestException();
      }
    } catch (err) {
      return err.response;
    }
  }

  async create(createAssignmentDto: CreateAssignmentDto, user: Users) {
    try {
      const today = new Date();
      if (today >= createAssignmentDto.dueAt) throw new BadRequestException();
      if (typeof createAssignmentDto.groupId == 'undefined') {
        const groups = await this.prismaService.groups.findMany();
        if (groups.length < 1) throw new NotFoundException();
        const groupIds = await Promise.all(
          groups.map(async (group) => {
            return { groupId: group.id };
          }),
        );
        const assignment = await this.prismaService.assignments.create({
          data: {
            title: createAssignmentDto.title,
            description: createAssignmentDto.description,
            dueAt: createAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              createMany: { data: groupIds },
            },
          },
        });

        if (assignment) {
          return assignment;
        }
        throw new BadRequestException();
      } else if (typeof createAssignmentDto.groupId == 'string') {
        const group = await this.prismaService.groups.findUnique({
          where: { id: createAssignmentDto.groupId },
        });
        if (!group) throw new NotFoundException();
        const assignment = await this.prismaService.assignments.create({
          data: {
            title: createAssignmentDto.title,
            description: createAssignmentDto.description,
            dueAt: createAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              create: { groupId: group.id },
            },
          },
        });
        if (assignment) {
          return assignment;
        }
        throw new BadRequestException();
      } else if (typeof createAssignmentDto.groupId == 'object') {
        const groups = await Promise.all(
          createAssignmentDto.groupId.map(async (assign) => {
            const query = await this.prismaService.groups.findUnique({
              where: { id: assign },
            });
            if (!query) throw new NotFoundException();
            return query;
          }),
        );
        if (groups.length < 1) throw new NotFoundException();
        const groupIds = await Promise.all(
          groups.map(async (group) => {
            return { groupId: group.id };
          }),
        );
        const assignment = await this.prismaService.assignments.create({
          data: {
            title: createAssignmentDto.title,
            description: createAssignmentDto.description,
            dueAt: createAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              createMany: { data: groupIds },
            },
          },
        });
        if (assignment) {
          return assignment;
        }
        throw new BadRequestException();
      }
    } catch (err) {
      return err.response;
    }
  }

  async removeFile(id: string) {
    try {
      const assignmentFile =
        await this.prismaService.assignmentFiles.findUnique({
          where: { id: id },
        });
      await this.minioService.delete(
        assignmentFile.name,
        assignmentFile.bucket,
      );
      await this.prismaService.assignmentFiles.delete({ where: { id: id } });
    } catch (err) {
      return err.response;
    }
  }

  async remove(id: string) {
    try {
      const assignmentFiles = await this.prismaService.assignmentFiles.findMany(
        {
          where: { assignmentId: id },
        },
      );
      await Promise.all(
        assignmentFiles.map(async (assignmentFile) => {
          await this.minioService.delete(
            assignmentFile.name,
            assignmentFile.bucket,
          );
        }),
      );
      await this.prismaService.assignments.delete({ where: { id: id } });
    } catch (err) {
      return err.response;
    }
  }

  async updateWithFile(
    id: string,
    updateAssignmentDto: UpdateAssignmentDto,
    files: BufferedFile[],
    user: Users,
  ) {
    try {
      const today = new Date();
      if (today >= updateAssignmentDto.dueAt) throw new BadRequestException();
      const fileQuery = await this.prismaService.assignmentFiles.aggregate({
        _count: { id: true },
        where: { assignmentId: id },
      });
      if (files.length + fileQuery._count.id > 5)
        throw new UnprocessableEntityException();
      if (typeof updateAssignmentDto.groupId == 'undefined') {
        const groups = await this.prismaService.groups.findMany();
        if (groups.length < 1) throw new NotFoundException();
        const groupIds = await Promise.all(
          groups.map(async (group) => {
            return { groupId: group.id };
          }),
        );
        const assignment = await this.prismaService.assignments.update({
          data: {
            title: updateAssignmentDto.title,
            description: updateAssignmentDto.description,
            dueAt: updateAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              deleteMany: {},
              createMany: { data: groupIds },
            },
          },
          where: { id: id },
        });
        if (assignment) {
          const uploads = await this.uploadImage(files);
          await Promise.all(
            uploads.map(async (upload) => {
              return await this.prismaService.assignmentFiles.create({
                data: {
                  bucket: upload.bucketName,
                  name: upload.filename,
                  Assignments: { connect: { id: assignment.id } },
                },
              });
            }),
          );
          return assignment;
        }
        throw new BadRequestException();
      } else if (typeof updateAssignmentDto.groupId == 'string') {
        const group = await this.prismaService.groups.findUnique({
          where: { id: updateAssignmentDto.groupId },
        });
        if (!group) throw new NotFoundException();
        const assignment = await this.prismaService.assignments.update({
          data: {
            title: updateAssignmentDto.title,
            description: updateAssignmentDto.description,
            dueAt: updateAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              deleteMany: {},
              create: { groupId: group.id },
            },
          },
          where: { id: id },
        });
        if (assignment) {
          const uploads = await this.uploadImage(files);
          await Promise.all(
            uploads.map(async (upload) => {
              return await this.prismaService.assignmentFiles.create({
                data: {
                  bucket: upload.bucketName,
                  name: upload.filename,
                  Assignments: { connect: { id: assignment.id } },
                },
              });
            }),
          );
          return assignment;
        }
        throw new BadRequestException();
      } else if (typeof updateAssignmentDto.groupId == 'object') {
        const groups = await Promise.all(
          updateAssignmentDto.groupId.map(async (assign) => {
            const query = await this.prismaService.groups.findUnique({
              where: { id: assign },
            });
            if (!query) throw new NotFoundException();
            return query;
          }),
        );
        if (groups.length < 1) throw new NotFoundException();
        const groupIds = await Promise.all(
          groups.map(async (group) => {
            return { groupId: group.id };
          }),
        );
        const assignment = await this.prismaService.assignments.update({
          data: {
            title: updateAssignmentDto.title,
            description: updateAssignmentDto.description,
            dueAt: updateAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              deleteMany: {},
              createMany: { data: groupIds },
            },
          },
          where: { id: id },
        });
        if (assignment) {
          const uploads = await this.uploadImage(files);
          await Promise.all(
            uploads.map(async (upload) => {
              return await this.prismaService.assignmentFiles.create({
                data: {
                  bucket: upload.bucketName,
                  name: upload.filename,
                  Assignments: { connect: { id: assignment.id } },
                },
              });
            }),
          );
          return assignment;
        }
        throw new BadRequestException();
      }
    } catch (err) {
      return err.response;
    }
  }

  async update(
    id: string,
    updateAssignmentDto: UpdateAssignmentDto,
    user: Users,
  ) {
    try {
      const today = new Date();
      if (today >= updateAssignmentDto.dueAt) throw new BadRequestException();
      if (typeof updateAssignmentDto.groupId == 'undefined') {
        const groups = await this.prismaService.groups.findMany();
        if (groups.length < 1) throw new NotFoundException();
        const groupIds = await Promise.all(
          groups.map(async (group) => {
            return { groupId: group.id };
          }),
        );
        const assignment = await this.prismaService.assignments.update({
          data: {
            title: updateAssignmentDto.title,
            description: updateAssignmentDto.description,
            dueAt: updateAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              deleteMany: {},
              createMany: { data: groupIds },
            },
          },
          where: { id: id },
        });
        if (assignment) {
          return assignment;
        }
        throw new BadRequestException();
      } else if (typeof updateAssignmentDto.groupId == 'string') {
        const group = await this.prismaService.groups.findUnique({
          where: { id: updateAssignmentDto.groupId },
        });
        if (!group) throw new NotFoundException();
        const assignment = await this.prismaService.assignments.update({
          data: {
            title: updateAssignmentDto.title,
            description: updateAssignmentDto.description,
            dueAt: updateAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              deleteMany: {},
              create: { groupId: group.id },
            },
          },
          where: { id: id },
        });
        if (assignment) {
          return assignment;
        }
        throw new BadRequestException();
      } else if (typeof updateAssignmentDto.groupId == 'object') {
        const groups = await Promise.all(
          updateAssignmentDto.groupId.map(async (assign) => {
            const query = await this.prismaService.groups.findUnique({
              where: { id: assign },
            });
            if (!query) throw new NotFoundException();
            return query;
          }),
        );
        if (groups.length < 1) throw new NotFoundException();
        const groupIds = await Promise.all(
          groups.map(async (group) => {
            return { groupId: group.id };
          }),
        );
        const assignment = await this.prismaService.assignments.update({
          data: {
            title: updateAssignmentDto.title,
            description: updateAssignmentDto.description,
            dueAt: updateAssignmentDto.dueAt,
            Users: { connect: { id: user.id } },
            AssignmentGroups: {
              deleteMany: {},
              createMany: { data: groupIds },
            },
          },
          where: { id: id },
        });
        if (assignment) {
          return assignment;
        }
        throw new BadRequestException();
      }
    } catch (err) {
      return err.response;
    }
  }

  async uploadImage(files: BufferedFile[]) {
    const uploaded_images = await Promise.all(
      files.map(async (file) => {
        const uploaded_image = await this.minioService.upload(
          file,
          'assignment',
        );
        return uploaded_image;
      }),
    );

    return uploaded_images;
  }

  async findAll(page: number = 1, perPage: number = 5) {
    try {
      const skip = page > 0 ? perPage * (page - 1) : 0;
      const count = await this.prismaService.assignments.aggregate({
        _count: { id: true },
      });
      const assignments = await this.prismaService.assignments.findMany({
        skip: skip,
        take: perPage,
        include: {
          AssignmentGroups: {
            include: {
              Groups: { include: { Topics: { include: { Tags: true } } } },
              Assignments: {
                include: {
                  AssignmentSubmit: {
                    include: { AssignmentSubmitFiles: true },
                  },
                },
              },
            },
          },
          AssignmentFiles: true,
          Users: true,
          CommentAssignments: { include: { Users: true } },
        },
        orderBy: { createAt: 'desc' },
      });

      const getDto = plainToClass(GetAssignmentDto, assignments, {
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
  ): Promise<PaginatedResult<GetAssignmentDto>> {
    try {
      const skip = page > 0 ? perPage * (page - 1) : 0;
      const assignments = await this.prismaService.assignments.findMany({
        where: { title: { contains: search } },
        skip: skip,
        take: perPage,
        include: {
          AssignmentGroups: {
            include: {
              Groups: { include: { Topics: { include: { Tags: true } } } },
              Assignments: {
                include: {
                  AssignmentSubmit: {
                    include: { AssignmentSubmitFiles: true },
                  },
                },
              },
            },
          },
          AssignmentFiles: true,
          Users: true,
          CommentAssignments: { include: { Users: true } },
        },
        orderBy: { createAt: 'desc' },
      });

      const getDto = plainToClass(GetAssignmentDto, assignments, {
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

  async findById(id: string): Promise<any> {
    try {
      const assignment = await this.prismaService.assignments.findUnique({
        where: { id: id },
        include: {
          AssignmentGroups: {
            include: {
              Groups: { include: { Topics: { include: { Tags: true } } } },
              Assignments: {
                include: {
                  AssignmentSubmit: {
                    include: { AssignmentSubmitFiles: true },
                  },
                },
              },
            },
          },
          AssignmentFiles: true,
          Users: true,
          CommentAssignments: { include: { Users: true } },
        },
      });
      if (!assignment) throw new NotFoundException();
      const getDto = plainToClass(GetAssignmentDto, assignment, {
        excludeExtraneousValues: true,
      });
      return getDto;
    } catch (err) {
      return err.response;
    }
  }

  async findByStd(id: string, user: Users) {
    try {
      const userGroup = await this.prismaService.userGroups.findUnique({
        where: { userId: user.id },
      });
      if (!userGroup) throw new ForbiddenException();
      const assign = await this.prismaService.assignmentSubmit.findUnique({
        where: { assignmentId: id, groupId: userGroup.groupId },
        include: {
          Assignments: {
            include: {
              AssignmentGroups: {
                include: {
                  Groups: { include: { Topics: { include: { Tags: true } } } },
                  Assignments: {
                    include: {
                      AssignmentSubmit: {
                        include: { AssignmentSubmitFiles: true },
                      },
                    },
                  },
                },
              },
              AssignmentFiles: true,
              Users: true,
              CommentAssignments: { include: { Users: true } },
            },
          },
        },
      });
      if (!assign) throw new NotFoundException();
      return assign;
    } catch (err) {
      return err.response;
    }
  }

  async findByProctor(page: number = 1, perPage: number = 5) {
    try {
      const skip = page > 0 ? perPage * (page - 1) : 0;

      const count = await this.prismaService.assignments.aggregate({
        _count: { id: true },
        where: { AssignmentSubmit: { some: { status: 'APPROVE_ADVISOR' } } },
      });
      const assignments = await this.prismaService.assignments.findMany({
        skip: skip,
        take: perPage,
        where: { AssignmentSubmit: { some: { status: 'APPROVE_ADVISOR' } } },
        include: {
          AssignmentGroups: {
            include: {
              Assignments: {
                include: {
                  AssignmentSubmit: {
                    include: {
                      AssignmentSubmitFiles: true,
                      Groups: {
                        include: { Topics: { include: { Tags: true } } },
                      },
                    },
                  },
                },
              },
            },
          },
          AssignmentFiles: true,
          Users: true,
          CommentAssignments: { include: { Users: true } },
        },
        orderBy: { createAt: 'desc' },
      });

      const getDto = plainToClass(GetAssignmentDto, assignments, {
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

  async findByProctorSearch(
    page: number = 1,
    search: string,
    perPage: number = 5,
  ) {
    try {
      const skip = page > 0 ? perPage * (page - 1) : 0;
      const assignments = await this.prismaService.assignments.findMany({
        where: {
          AssignmentSubmit: { some: { status: 'APPROVE_ADVISOR' } },
          title: { contains: search },
        },
        skip: skip,
        take: perPage,
        include: {
          AssignmentGroups: {
            include: {
              Groups: { include: { Topics: { include: { Tags: true } } } },
              Assignments: {
                include: {
                  AssignmentSubmit: {
                    include: { AssignmentSubmitFiles: true },
                  },
                },
              },
            },
          },
          AssignmentFiles: true,
          Users: true,
          CommentAssignments: { include: { Users: true } },
        },
        orderBy: { createAt: 'desc' },
      });

      const getDto = plainToClass(GetAssignmentDto, assignments, {
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

  async findByGroupIdSearch(
    userId: string,
    page: number,
    search: string,
    perPage: number = 5,
  ) {
    try {
      const skip = page > 0 ? perPage * (page - 1) : 0;

      const group = await this.prismaService.userGroups.findUnique({
        where: { userId: userId },
      });

      if (!group) throw new NotFoundException();

      const assignment = await this.prismaService.assignments.findMany({
        skip: skip,
        take: perPage,
        where: {
          AssignmentGroups: { every: { Groups: { id: group.groupId } } },
          title: search,
        },
        include: {
          AssignmentGroups: {
            include: {
              Groups: { include: { Topics: { include: { Tags: true } } } },
              Assignments: {
                include: {
                  AssignmentSubmit: {
                    include: { AssignmentSubmitFiles: true },
                  },
                },
              },
            },
          },
          AssignmentFiles: true,
          Users: true,
          CommentAssignments: { include: { Users: true } },
        },
        orderBy: { createAt: 'desc' },
      });
      const getDto = plainToClass(GetAssignmentDto, assignment, {
        excludeExtraneousValues: true,
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

  async findByGroupId(userId: string, page: number = 1, perPage: number = 5) {
    try {
      const skip = page > 0 ? perPage * (page - 1) : 0;

      const group = await this.prismaService.userGroups.findUnique({
        where: { userId: userId },
      });

      if (!group) throw new NotFoundException();

      const count = await this.prismaService.assignments.aggregate({
        _count: { id: true },
        where: { AssignmentGroups: { every: { groupId: group.groupId } } },
      });
      const assignment = await this.prismaService.assignments.findMany({
        skip: skip,
        take: perPage,
        where: {
          AssignmentGroups: { every: { Groups: { id: group.groupId } } },
        },
        include: {
          AssignmentGroups: {
            include: {
              Groups: { include: { Topics: { include: { Tags: true } } } },
              Assignments: {
                include: {
                  AssignmentSubmit: {
                    include: { AssignmentSubmitFiles: true },
                  },
                },
              },
            },
          },
          AssignmentFiles: true,
          Users: true,
          CommentAssignments: { include: { Users: true } },
        },
        orderBy: { createAt: 'desc' },
      });
      const getDto = plainToClass(GetAssignmentDto, assignment, {
        excludeExtraneousValues: true,
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
}
