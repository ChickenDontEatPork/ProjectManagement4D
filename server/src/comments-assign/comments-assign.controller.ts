import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CommentsAssignService } from './comments-assign.service';
import { CreateCommentsAssignDto } from './dto/create-comments-assign.dto';
import { UpdateCommentsAssignDto } from './dto/update-comments-assign.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';

@Controller('comments-assign')
@ApiTags('comments-assign')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsAssignController {
  constructor(private readonly commentsAssignService: CommentsAssignService) {}

  @Post()
  async create(
    @Body() createCommentsAssignDto: CreateCommentsAssignDto,
    @GetUser() user: Users,
  ) {
    return await this.commentsAssignService.create(
      createCommentsAssignDto,
      user.id,
    );
  }

  @Get()
  async findAll() {
    return await this.commentsAssignService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentsAssignService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentsAssignDto: UpdateCommentsAssignDto,
    @GetUser() user: Users,
  ) {
    return await this.commentsAssignService.update(
      id,
      updateCommentsAssignDto,
      user.id,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: Users) {
    return await this.commentsAssignService.remove(id, user);
  }
}
