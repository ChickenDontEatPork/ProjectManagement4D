import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { RolesGuard } from '@/auth/guards/role.guard';
import { Role } from '@/shared/enums/role.enum';
import { Roles } from '@/auth/decorators/role.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GetTopicDto } from './dto/get-topic.dto';

@Controller('topic')
@ApiTags('topic')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Roles(Role.PROCTOR, Role.ADVISOR)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createTopicDto: CreateTopicDto) {
    return await this.topicService.create(createTopicDto);
  }

  @Get()
  async findAll(@Query() query) {
    return await this.topicService.findAll(+query.page || 1);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetTopicDto> {
    return await this.topicService.findOne(id);
  }

  @Roles(Role.PROCTOR, Role.ADVISOR)
  @UseGuards(RolesGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return await this.topicService.update(id, updateTopicDto);
  }

  @Roles(Role.PROCTOR, Role.ADVISOR)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.topicService.remove(id);
  }
}
