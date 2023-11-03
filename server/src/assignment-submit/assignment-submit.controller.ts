import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AssignmentSubmitService } from './assignment-submit.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { RolesGuard } from '@/auth/guards/role.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '@/minio-client/model/file.model';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { CreateAssignmentSubmitDto } from './dto/create-assignmentSubmit.dto';
import { Roles } from '@/auth/decorators/role.decorator';
import { Role } from '@/shared/enums/role.enum';
import { UpdateProtorDto } from './dto/update-proctor.dto';

@ApiTags('assignment-submit')
@Controller('assignment-submit')
@UseGuards(JwtGuard, RolesGuard)
export class AssignmentSubmitController {
  constructor(
    private readonly assignmentSubmitService: AssignmentSubmitService,
  ) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.assignmentSubmitService.findById(id);
  }

  @Put('/cancle/:id')
  async cancleAssignment(@Param('id') id: string, @GetUser() user: Users) {
    return this.assignmentSubmitService.cancleAssignment(id, user);
  }

  @Put('/proctor/:id')
  @Roles(Role.PROCTOR)
  async updateByProctor(
    @Param('id') id: string,
    @Body() updateProtorDto: UpdateProtorDto,
  ) {
    return await this.assignmentSubmitService.updateByProctor(
      id,
      updateProtorDto,
    );
  }

  @Put('/advisor/:id')
  @Roles(Role.ADVISOR)
  async updateByAdvisor(
    @Param('id') id: string,
    @Body() updateProtorDto: UpdateProtorDto,
  ) {
    return await this.assignmentSubmitService.updateByAdvisor(
      id,
      updateProtorDto,
    );
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string, @GetUser() user: Users) {
    return await this.assignmentSubmitService.deleteImage(id, user);
  }

  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  async createAssignment(
    @UploadedFiles()
    files: BufferedFile[],
    @Body() createAssignmentSubmit: CreateAssignmentSubmitDto,
    @GetUser() user: Users,
  ) {
    if (files != undefined && files.length > 0) {
      return await this.assignmentSubmitService.createWithFile(
        files,
        createAssignmentSubmit,
        user,
      );
    } else {
      return await this.assignmentSubmitService.create(
        createAssignmentSubmit,
        user,
      );
    }
  }
}
