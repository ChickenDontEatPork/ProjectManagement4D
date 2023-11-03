import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { RolesGuard } from '@/auth/guards/role.guard';
import { Roles } from '@/auth/decorators/role.decorator';
import { Role } from '@/shared/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('tag')
@ApiTags('tag')
@UseGuards(JwtGuard, RolesGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Roles(Role.PROCTOR)
  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    return await this.tagService.create(createTagDto);
  }

  @Get()
  async findAll() {
    return await this.tagService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tagService.findOne(id);
  }

  @Roles(Role.PROCTOR)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return await this.tagService.update(id, updateTagDto);
  }

  @Roles(Role.PROCTOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tagService.remove(id);
  }
}
