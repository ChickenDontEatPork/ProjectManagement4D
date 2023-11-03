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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Groups, Users } from '@prisma/client';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';

@ApiTags('group')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @GetUser() user: Users,
  ): Promise<Groups> {
    return await this.groupService.create(createGroupDto, user);
  }
  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('search') search: string | undefined = undefined,
  ): Promise<Groups[]> {
    if (!search) {
      return await this.groupService.findAll(+page);
    }
    return await this.groupService.findAllSearch(+page, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Groups> {
    return await this.groupService.findOne(id);
  }

  @Put(':id')
  async update(
    @Body() updateGroupDto: UpdateGroupDto,
    @Param('id') id: string,
  ): Promise<Groups> {
    return await this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
