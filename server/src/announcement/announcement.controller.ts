import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Put,
  Delete,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { Role } from '@/shared/enums/role.enum';
import { RolesGuard } from '@/auth/guards/role.guard';
import { Roles } from '@/auth/decorators/role.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '@/minio-client/model/file.model';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { Announcements, Users } from '@prisma/client';
import { PaginatedResult } from '@/shared/interfaces/paginate.interface';

@ApiTags('announcement')
@UseGuards(JwtGuard, RolesGuard)
@Controller('announcement')
@UseInterceptors(ClassSerializerInterceptor)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post('')
  @Roles(Role.ADVISOR, Role.PROCTOR)
  @UseInterceptors(FilesInterceptor('files'))
  async createWithFile(
    @UploadedFiles() files: BufferedFile[],
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @GetUser() user: Users,
  ) {
    if (files != undefined && files.length > 0) {
      return await this.announcementService.createWithFile(
        createAnnouncementDto,
        files,
        user,
      );
    } else {
      return await this.announcementService.create(createAnnouncementDto, user);
    }
  }

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('search') search: string | undefined = undefined,
  ) {
    if (!search) {
      return await this.announcementService.findAll(+page);
    }
    return await this.announcementService.findAllSearch(+page, search);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<PaginatedResult<Announcements>> {
    return await this.announcementService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADVISOR, Role.PROCTOR)
  @UseInterceptors(FilesInterceptor('files'))
  async updateWithFile(
    @UploadedFiles() files: BufferedFile[],
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @GetUser() user: Users,
  ) {
    if (files.length > 0) {
      return await this.announcementService.updateWithFile(
        id,
        updateAnnouncementDto,
        files,
        user,
      );
    } else {
      return await this.announcementService.update(
        id,
        updateAnnouncementDto,
        user,
      );
    }
  }

  @Delete(':id')
  @Roles(Role.ADVISOR, Role.PROCTOR)
  async remove(@Param('id') id: string, @GetUser() user: Users) {
    return await this.announcementService.remove(id, user);
  }

  @Delete('file/:id')
  @Roles(Role.ADVISOR, Role.PROCTOR)
  async removeFile(@Param('id') id: string, @GetUser() user: Users) {
    return await this.announcementService.removeFile(id, user);
  }
}
