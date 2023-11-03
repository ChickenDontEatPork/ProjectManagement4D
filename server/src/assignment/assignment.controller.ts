import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { BufferedFile } from '@/minio-client/model/file.model';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { RolesGuard } from '@/auth/guards/role.guard';
import { Role } from '@/shared/enums/role.enum';
import { Roles } from '@/auth/decorators/role.decorator';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { GetAssignmentDto } from './dto/get-assignment.dto';
import { PaginatedResult } from '@/shared/interfaces/paginate.interface';

@ApiTags('assignment')
@UseGuards(JwtGuard, RolesGuard)
@Controller('assignment')
@UseInterceptors(ClassSerializerInterceptor)
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Roles(Role.ADVISOR, Role.PROCTOR)
  @Delete('file/:id')
  async removeFile(@Param('id') id: string) {
    return await this.assignmentService.removeFile(id);
  }

  @Roles(Role.ADVISOR, Role.PROCTOR)
  @Put(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async updateWithFile(
    @UploadedFiles() files: BufferedFile[],
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @GetUser() user: Users,
  ) {
    if (files.length > 0) {
      return await this.assignmentService.updateWithFile(
        id,
        updateAssignmentDto,
        files,
        user,
      );
    } else {
      return await this.assignmentService.update(id, updateAssignmentDto, user);
    }
  }

  @Roles(Role.PROCTOR, Role.ADVISOR)
  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  async createAssignment(
    @UploadedFiles()
    files: BufferedFile[],
    @Body() createAssignmentDto: CreateAssignmentDto,
    @GetUser() user: Users,
  ) {
    if (files && files.length > 0) {
      return await this.assignmentService.createWithFile(
        files,
        createAssignmentDto,
        user,
      );
    } else {
      return await this.assignmentService.create(createAssignmentDto, user);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<GetAssignmentDto> {
    return await this.assignmentService.findById(id);
  }

  @Get('student/group')
  async findByGroupId(
    @Query('page') page: string,
    @Query('search') search: string | undefined = undefined,
    @GetUser() user: Users,
  ) {
    if (search) {
      return await this.assignmentService.findByGroupId(user.id, +page);
    }
    return await this.assignmentService.findByGroupIdSearch(
      user.id,
      +page,
      search,
    );
  }

  @Get('proctor/group')
  @Roles(Role.PROCTOR)
  async findByProctor(
    @Query('page') page: string,
    @Query('search') search: string | undefined = undefined,
  ) {
    if (!search) {
      return await this.assignmentService.findByProctor(+page);
    }
    return await this.assignmentService.findByProctorSearch(+page, search);
  }

  @Roles(Role.PROCTOR)
  @Get('')
  async findAll(
    @Query('page') page: string,
    @Query('search') search: string | undefined = undefined,
  ): Promise<PaginatedResult<GetAssignmentDto[] | GetAssignmentDto>> {
    if (!search) {
      return await this.assignmentService.findAll(+page);
    }
    return await this.assignmentService.findAllSearch(+page, search);
  }

  @Roles(Role.PROCTOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.assignmentService.remove(id);
  }

  @Get('/student/submit/:id')
  async findByStd(@Param('id') id: string, @GetUser() user: Users) {
    return await this.assignmentService.findByStd(id, user);
  }
}
