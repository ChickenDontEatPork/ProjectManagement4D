import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { Users } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '@/auth/guards/role.guard';
import { Roles } from '@/auth/decorators/role.decorator';
import { Role } from '@/shared/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { GetUserDto } from './dto/get-user.dto';
@Controller('user')
@ApiTags('user')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @Roles(Role.PROCTOR)
  @UseGuards(RolesGuard)
  async findAll(): Promise<GetUserDto[]> {
    return await this.userService.findAll();
  }

  @Get('/advisors')
  async getAdvisor(): Promise<GetUserDto[]> {
    return await this.userService.findAdvisors();
  }

  @Get('/profile')
  async getCurrentUser(@GetUser() user: Users): Promise<GetUserDto> {
    return user;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @GetUser() user: Users,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    if (user.id != id) throw new ForbiddenException();
    return await this.userService.update(updateUserDto, id);
  }
}
