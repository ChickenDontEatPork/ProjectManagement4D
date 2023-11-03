import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CommentsAnnounceService } from './comments-announce.service';
import { CreateCommentsAnnounceDto } from './dto/create-comments-announce.dto';
import { UpdateCommentsAnnounceDto } from './dto/update-comments-announce.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';

@Controller('comments-announce')
@ApiTags('comments-announce')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsAnnounceController {
  constructor(
    private readonly commentsAnnounceService: CommentsAnnounceService,
  ) {}

  @Post()
  async create(
    @Body() createCommentsAnnounceDto: CreateCommentsAnnounceDto,
    @GetUser() user: Users,
  ) {
    return await this.commentsAnnounceService.create(
      createCommentsAnnounceDto,
      user.id,
    );
  }

  @Get()
  async findAll() {
    return await this.commentsAnnounceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentsAnnounceService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentsAnnounceDto: UpdateCommentsAnnounceDto,
    @GetUser() user: Users,
  ) {
    if (id != user.id) throw new ForbiddenException();

    return await this.commentsAnnounceService.update(
      id,
      updateCommentsAnnounceDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: Users) {
    return await this.commentsAnnounceService.remove(id, user);
  }
}
