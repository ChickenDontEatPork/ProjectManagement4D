import { GetUserDto } from '@/user/dto/get-user.dto';
import { Expose, Type } from 'class-transformer';

export class GetCommentDto {
  @Expose()
  id: string;
  @Expose()
  description: string;

  @Expose()
  @Type(() => GetUserDto)
  Users: GetUserDto;

  @Expose()
  createAt: Date;

  @Expose()
  modifyAt: Date;
}
