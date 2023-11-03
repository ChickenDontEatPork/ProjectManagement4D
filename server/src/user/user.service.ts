import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Users } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAdvisors(): Promise<GetUserDto[]> {
    const user = await this.prisma.users.findMany({
      where: { role: Role.ADVISOR },
    });
    const getDto = plainToClass(GetUserDto, user);
    return getDto;
  }

  async findAdvisor(id: string): Promise<GetUserDto> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { role: Role.ADVISOR, id: id },
      });
      if (!user) throw new NotFoundException();
      const getDto = plainToClass(GetUserDto, user);
      return getDto;
    } catch (err) {
      return err.response;
    }
  }

  async findAll(): Promise<GetUserDto[]> {
    try {
      const user = await this.prisma.users.findMany();
      const getDto = plainToClass(GetUserDto, user);
      return getDto;
    } catch (err) {
      return err.response;
    }
  }

  async findOne(id: string): Promise<GetUserDto> {
    try {
      const query = await this.prisma.users.findUnique({
        where: { id: id },
      });
      if (!query) throw new NotFoundException();
      const getDto = plainToClass(GetUserDto, query);
      return getDto;
    } catch (err) {
      return err.response;
    }
  }

  async update(updateUserDto: UpdateUserDto, id: string): Promise<Users> {
    try {
      const user = await this.findOne(id);
      if (!user) throw new NotFoundException();
      user.name = updateUserDto.name;
      user.lastname = updateUserDto.lastname;
      user.tel = updateUserDto.tel;
      if (user.name != null || user.lastname != null || user.tel != null)
        user.register = true;
      const updateUser = await this.prisma.users.update({
        data: user,
        where: { id: id },
      });
      return updateUser;
    } catch (err) {
      return err.response;
    }
  }
}
