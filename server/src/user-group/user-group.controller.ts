import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { UserGroups } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('user-group')
@Controller('user-group')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @Get()
  async findAll(): Promise<UserGroups[]> {
    return await this.userGroupService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserGroups> {
    return await this.userGroupService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userGroupService.remove(id);
  }
}
