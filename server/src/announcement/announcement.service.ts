import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Users } from '@prisma/client';
import { BufferedFile } from '@/minio-client/model/file.model';
import { MinioClientService } from '@/minio-client/minio-client.service';
import { PrismaService } from '@/prisma/prisma.service';
import { TagService } from '@/tag/tag.service';
import { GetAnnouncementDto } from './dto/get-announcement.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AnnouncementService {
  constructor(
    private minioService: MinioClientService,
    private prismaService: PrismaService,
    private tagService: TagService,
  ) {}
  async createWithFile(
    createAnnouncementDto: CreateAnnouncementDto,
    files: BufferedFile[],
    user: Users,
  ) {
    try {
      if (typeof createAnnouncementDto.tagId == 'undefined') {
        if (files.length > 5) throw new UnprocessableEntityException();
        const tagsQuery = await this.prismaService.tags.findMany();
        if (tagsQuery.length < 1) throw new NotFoundException();
        const tags = await Promise.all(
          tagsQuery.map(async (d) => {
            const tag = await this.tagService.findOne(d.id);
            if (!tag) throw new NotFoundException();
            return { Tags: { connect: { id: tag.id } } };
          }),
        );
        const announcement = await this.prismaService.announcements.create({
          data: {
            title: createAnnouncementDto.title,
            description: createAnnouncementDto.description,
            AnnouncementTag: {
              create: tags,
            },
            Advisor: {
              connect: { id: user.id },
            },
          },
          include: {
            Advisor: true,
            AnnouncementFiles: true,
            AnnouncementTag: true,
          },
        });
        const uploadFiles = await this.uploadImage(files);
        await Promise.all(
          uploadFiles.map(async (fileuploadFile) => {
            const announcementFile =
              await this.prismaService.announcementFiles.create({
                data: {
                  bucket: fileuploadFile.bucketName,
                  name: fileuploadFile.filename,
                  Announcements: {
                    connect: { id: announcement.id },
                  },
                },
              });
            return announcementFile;
          }),
        );
        return announcement;
      } else if (typeof createAnnouncementDto.tagId == 'string') {
        if (files.length > 5) throw new UnprocessableEntityException();
        const tags = await this.prismaService.tags.findUnique({
          where: { id: createAnnouncementDto.tagId },
        });
        if (!tags) throw new NotFoundException();
        const announcement = await this.prismaService.announcements.create({
          data: {
            title: createAnnouncementDto.title,
            description: createAnnouncementDto.description,
            AnnouncementTag: {
              create: { tagId: tags.id },
            },
            Advisor: {
              connect: { id: user.id },
            },
          },
          include: {
            Advisor: true,
            AnnouncementFiles: true,
            AnnouncementTag: true,
          },
        });
        const uploadFiles = await this.uploadImage(files);
        await Promise.all(
          uploadFiles.map(async (fileuploadFile) => {
            const announcementFile =
              await this.prismaService.announcementFiles.create({
                data: {
                  bucket: fileuploadFile.bucketName,
                  name: fileuploadFile.filename,
                  Announcements: {
                    connect: { id: announcement.id },
                  },
                },
              });
            return announcementFile;
          }),
        );
        return announcement;
      } else if (typeof createAnnouncementDto.tagId == 'object') {
        if (files.length > 5) throw new UnprocessableEntityException();
        const tags = await Promise.all(
          createAnnouncementDto.tagId.map(async (d) => {
            const tag = await this.tagService.findOne(d);
            if (!tag) throw new NotFoundException();
            return { Tags: { connect: { id: tag.id } } };
          }),
        );
        const announcement = await this.prismaService.announcements.create({
          data: {
            title: createAnnouncementDto.title,
            description: createAnnouncementDto.description,
            AnnouncementTag: {
              create: tags,
            },
            Advisor: {
              connect: { id: user.id },
            },
          },
          include: {
            Advisor: true,
            AnnouncementFiles: true,
            AnnouncementTag: true,
          },
        });
        const uploadFiles = await this.uploadImage(files);
        await Promise.all(
          uploadFiles.map(async (fileuploadFile) => {
            const announcementFile =
              await this.prismaService.announcementFiles.create({
                data: {
                  bucket: fileuploadFile.bucketName,
                  name: fileuploadFile.filename,
                  Announcements: {
                    connect: { id: announcement.id },
                  },
                },
              });
            return announcementFile;
          }),
        );
        return announcement;
      }
    } catch (err) {
      return err.response;
    }
  }

  async create(createAnnouncementDto: CreateAnnouncementDto, user: Users) {
    try {
      if (typeof createAnnouncementDto.tagId == 'undefined') {
        const tagsQuery = await this.prismaService.tags.findMany();
        if (tagsQuery.length < 1) throw new NotFoundException();
        const tags = await Promise.all(
          tagsQuery.map(async (d) => {
            const tag = await this.tagService.findOne(d.id);
            if (!tag) throw new NotFoundException();
            return { Tags: { connect: { id: tag.id } } };
          }),
        );
        const announcement = await this.prismaService.announcements.create({
          data: {
            title: createAnnouncementDto.title,
            description: createAnnouncementDto.description,
            AnnouncementTag: {
              create: tags,
            },
            Advisor: {
              connect: { id: user.id },
            },
          },
          include: {
            Advisor: true,
            AnnouncementFiles: true,
            AnnouncementTag: true,
          },
        });

        return announcement;
      } else if (typeof createAnnouncementDto.tagId == 'object') {
        const tags = await Promise.all(
          createAnnouncementDto.tagId.map(async (d) => {
            const tag = await this.tagService.findOne(d);
            if (!tag) throw new NotFoundException();
            return { Tags: { connect: { id: tag.id } } };
          }),
        );
        const announcement = await this.prismaService.announcements.create({
          data: {
            title: createAnnouncementDto.title,
            description: createAnnouncementDto.description,
            AnnouncementTag: {
              create: tags,
            },
            Advisor: {
              connect: { id: user.id },
            },
          },
          include: {
            Advisor: true,
            AnnouncementFiles: true,
            AnnouncementTag: true,
          },
        });

        return announcement;
      } else if (typeof createAnnouncementDto.tagId == 'string') {
        const tags = await this.prismaService.tags.findUnique({
          where: { id: createAnnouncementDto.tagId },
        });
        if (!tags) throw new NotFoundException();
        const announcement = await this.prismaService.announcements.create({
          data: {
            title: createAnnouncementDto.title,
            description: createAnnouncementDto.description,
            AnnouncementTag: {
              create: { tagId: tags.id },
            },
            Advisor: {
              connect: { id: user.id },
            },
          },
          include: {
            Advisor: true,
            AnnouncementFiles: true,
            AnnouncementTag: true,
          },
        });

        return announcement;
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
          'announcement',
        );
        return uploaded_image;
      }),
    );

    return uploaded_images;
  }

  async findAll(page: number = 1, perPage: number = 5) {
    const skip = page > 0 ? perPage * (page - 1) : 0;
    const count = await this.prismaService.announcements.aggregate({
      _count: { id: true },
    });
    const announcements = await this.prismaService.announcements.findMany({
      skip: skip,
      take: perPage,
      include: {
        Advisor: true,
        AnnouncementTag: { include: { Tags: true } },
        CommentAnnoucements: { include: { Users: true } },
        AnnouncementFiles: true,
      },
      orderBy: { createAt: 'desc' },
    });
    const getDto = plainToClass(GetAnnouncementDto, announcements, {
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
  }

  async findAllSearch(
    page: number = 1,
    search: string = '',
    perPage: number = 5,
  ) {
    try {
      const skip = page > 0 ? perPage * (page - 1) : 0;
      const announcements = await this.prismaService.announcements.findMany({
        where: { title: { contains: search } },
        skip: skip,
        take: perPage,
        include: {
          Advisor: true,
          AnnouncementTag: { include: { Tags: true } },
          CommentAnnoucements: { include: { Users: true } },
          AnnouncementFiles: true,
        },
        orderBy: { createAt: 'desc' },
      });
      const getDto = plainToClass(GetAnnouncementDto, announcements, {
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

  async findOne(id: string) {
    try {
      const announcement = await this.prismaService.announcements.findUnique({
        where: { id: id },
        include: {
          Advisor: true,
          AnnouncementTag: { include: { Tags: true } },
          CommentAnnoucements: { include: { Users: true } },
          AnnouncementFiles: true,
        },
      });
      if (!announcement) throw new NotFoundException();
      return announcement;
    } catch (err) {
      return err.response;
    }
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
    user: Users,
  ) {
    try {
      if (typeof updateAnnouncementDto.tagId == 'undefined') {
        const assignQuery = await this.prismaService.announcements.findUnique({
          where: { id: id },
        });
        if (!assignQuery) throw new NotFoundException();
        if (user.role == 'ADVISOR' && user.id != assignQuery.advisorId)
          throw new ForbiddenException();
        const tagsQuery = await this.prismaService.tags.findMany();
        if (tagsQuery.length < 1) throw new NotFoundException();
        const tags = await Promise.all(
          tagsQuery.map(async (d) => {
            const tag = await this.tagService.findOne(d.id);
            if (!tag) throw new NotFoundException();
            return { Tags: { connect: { id: tag.id } } };
          }),
        );
        const updateAnnouncement =
          await this.prismaService.announcements.update({
            where: { id: id },
            data: {
              title: updateAnnouncementDto.title,
              description: updateAnnouncementDto.description,
              Advisor: { connect: { id: user.id } },
              AnnouncementTag: { create: tags },
            },
            include: {
              Advisor: true,
              AnnouncementFiles: true,
              AnnouncementTag: true,
            },
          });

        return updateAnnouncement;
      } else if (typeof updateAnnouncementDto.tagId == 'object') {
        const assignQuery = await this.prismaService.announcements.findUnique({
          where: { id: id },
        });
        if (!assignQuery) throw new NotFoundException();
        if (user.role == 'ADVISOR' && user.id != assignQuery.advisorId)
          throw new ForbiddenException();
        const tags = await Promise.all(
          updateAnnouncementDto.tagId.map(async (d) => {
            const tag = await this.tagService.findOne(d);
            if (!tag) throw new NotFoundException();
            return { Tags: { connect: { id: tag.id } } };
          }),
        );
        const updateAnnouncement =
          await this.prismaService.announcements.update({
            where: { id: id },
            data: {
              title: updateAnnouncementDto.title,
              description: updateAnnouncementDto.description,
              Advisor: { connect: { id: user.id } },
              AnnouncementTag: { create: tags },
            },
            include: {
              Advisor: true,
              AnnouncementFiles: true,
              AnnouncementTag: true,
            },
          });

        return updateAnnouncement;
      } else if (typeof updateAnnouncementDto.tagId == 'string') {
        const assignQuery = await this.prismaService.announcements.findUnique({
          where: { id: id },
        });
        if (!assignQuery) throw new NotFoundException();
        if (user.role == 'ADVISOR' && user.id != assignQuery.advisorId)
          throw new ForbiddenException();
        const tags = await this.prismaService.tags.findUnique({
          where: { id: updateAnnouncementDto.tagId },
        });
        if (!tags) throw new NotFoundException();
        const updateAnnouncement =
          await this.prismaService.announcements.update({
            where: { id: id },
            data: {
              title: updateAnnouncementDto.title,
              description: updateAnnouncementDto.description,
              Advisor: { connect: { id: user.id } },
              AnnouncementTag: { create: { tagId: tags.id } },
            },
            include: {
              Advisor: true,
              AnnouncementFiles: true,
              AnnouncementTag: true,
            },
          });

        return updateAnnouncement;
      }
    } catch (err) {
      return err.response;
    }
  }

  async remove(id: string, user: Users) {
    try {
      const assign = await this.prismaService.announcements.findUnique({
        where: { id: id },
      });
      if (!assign) throw new NotFoundException();
      if (user.role == 'ADVISOR' && user.id != assign.advisorId)
        throw new ForbiddenException();
      const announcementFiles =
        await this.prismaService.announcementFiles.findMany({
          where: { announcementId: id },
        });
      await Promise.all(
        announcementFiles.map(async (announcementFile) => {
          await this.minioService.delete(
            announcementFile.name,
            announcementFile.bucket,
          );
        }),
      );
      await this.prismaService.announcements.delete({ where: { id: id } });
    } catch (err) {
      return err.response;
    }
  }

  async removeFile(id: string, user: Users) {
    try {
      const assign = await this.prismaService.assignmentFiles.findUnique({
        where: { id: id },
        include: { Assignments: true },
      });
      if (!assign) throw new NotFoundException();
      if (user.role == 'ADVISOR' && user.id != assign.Assignments.advisorId)
        throw new ForbiddenException();
      const announcementFile =
        await this.prismaService.announcementFiles.findUnique({
          where: { id: id },
        });
      await this.minioService.delete(
        announcementFile.name,
        announcementFile.bucket,
      );
      await this.prismaService.announcementFiles.delete({ where: { id: id } });
    } catch (err) {
      return err.response;
    }
  }

  async updateWithFile(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
    files: BufferedFile[],
    user: Users,
  ) {
    try {
      if (typeof updateAnnouncementDto.tagId == 'undefined') {
        const assignQuery = await this.prismaService.announcements.findUnique({
          where: { id: id },
        });
        if (!assignQuery) throw new NotFoundException();
        if (user.role == 'ADVISOR' && user.id != assignQuery.advisorId)
          throw new ForbiddenException();
        const countFile = await this.prismaService.announcementFiles.aggregate({
          _count: { id: true },
          where: { announcementId: id },
        });
        if (countFile._count.id + files.length > 5)
          throw new ForbiddenException();
        const tagsQuery = await this.prismaService.tags.findMany();
        if (tagsQuery.length < 1) throw new NotFoundException();
        const tags = await Promise.all(
          tagsQuery.map(async (d) => {
            const tag = await this.tagService.findOne(d.id);
            if (!tag) throw new NotFoundException();
            return { Tags: { connect: { id: tag.id } } };
          }),
        );
        const updateAnnouncement =
          await this.prismaService.announcements.update({
            where: { id: id },
            data: {
              title: updateAnnouncementDto.title,
              description: updateAnnouncementDto.description,
              Advisor: { connect: { id: user.id } },
              AnnouncementTag: { create: tags },
            },
            include: {
              Advisor: true,
              AnnouncementFiles: true,
              AnnouncementTag: true,
            },
          });
        const uploadFiles = await this.uploadImage(files);
        await Promise.all(
          uploadFiles.map(async (fileuploadFile) => {
            const announcementFile =
              await this.prismaService.announcementFiles.create({
                data: {
                  bucket: fileuploadFile.bucketName,
                  name: fileuploadFile.filename,
                  Announcements: { connect: { id: id } },
                },
              });
            return announcementFile;
          }),
        );
        return updateAnnouncement;
      } else if (typeof updateAnnouncementDto.tagId == 'string') {
        const assignQuery = await this.prismaService.announcements.findUnique({
          where: { id: id },
        });
        if (!assignQuery) throw new NotFoundException();
        if (user.role == 'ADVISOR' && user.id != assignQuery.advisorId)
          throw new ForbiddenException();
        const countFile = await this.prismaService.announcementFiles.aggregate({
          _count: { id: true },
          where: { announcementId: id },
        });
        if (countFile._count.id + files.length > 5)
          throw new ForbiddenException();
        const tags = await this.prismaService.tags.findUnique({
          where: { id: updateAnnouncementDto.tagId },
        });
        if (!tags) throw new NotFoundException();
        const updateAnnouncement =
          await this.prismaService.announcements.update({
            where: { id: id },
            data: {
              title: updateAnnouncementDto.title,
              description: updateAnnouncementDto.description,
              Advisor: { connect: { id: user.id } },
              AnnouncementTag: { create: { tagId: tags.id } },
            },
            include: {
              Advisor: true,
              AnnouncementFiles: true,
              AnnouncementTag: true,
            },
          });
        const uploadFiles = await this.uploadImage(files);
        await Promise.all(
          uploadFiles.map(async (fileuploadFile) => {
            const announcementFile =
              await this.prismaService.announcementFiles.create({
                data: {
                  bucket: fileuploadFile.bucketName,
                  name: fileuploadFile.filename,
                  Announcements: { connect: { id: id } },
                },
              });
            return announcementFile;
          }),
        );
        return updateAnnouncement;
      } else if (typeof updateAnnouncementDto.tagId == 'object') {
        const assignQuery = await this.prismaService.announcements.findUnique({
          where: { id: id },
        });
        if (!assignQuery) throw new NotFoundException();
        if (user.role == 'ADVISOR' && user.id != assignQuery.advisorId)
          throw new ForbiddenException();
        const countFile = await this.prismaService.announcementFiles.aggregate({
          _count: { id: true },
          where: { announcementId: id },
        });
        if (countFile._count.id + files.length > 5)
          throw new ForbiddenException();
        const tags = await Promise.all(
          updateAnnouncementDto.tagId.map(async (d) => {
            const tag = await this.tagService.findOne(d);
            if (!tag) throw new NotFoundException();
            return { Tags: { connect: { id: tag.id } } };
          }),
        );
        const updateAnnouncement =
          await this.prismaService.announcements.update({
            where: { id: id },
            data: {
              title: updateAnnouncementDto.title,
              description: updateAnnouncementDto.description,
              Advisor: { connect: { id: user.id } },
              AnnouncementTag: { create: tags },
            },
            include: {
              Advisor: true,
              AnnouncementFiles: true,
              AnnouncementTag: true,
            },
          });
        const uploadFiles = await this.uploadImage(files);
        await Promise.all(
          uploadFiles.map(async (fileuploadFile) => {
            const announcementFile =
              await this.prismaService.announcementFiles.create({
                data: {
                  bucket: fileuploadFile.bucketName,
                  name: fileuploadFile.filename,
                  Announcements: { connect: { id: id } },
                },
              });
            return announcementFile;
          }),
        );
        return updateAnnouncement;
      }
    } catch (err) {
      return err.response;
    }
  }
}
