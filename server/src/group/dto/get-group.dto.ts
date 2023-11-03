import { GetTopicDto } from '@/topic/dto/get-topic.dto';
import { GetUserDto } from '@/user/dto/get-user.dto';
import { Expose, Type } from 'class-transformer';

export class UserGroups {
  @Expose()
  @Type(() => GetUserDto)
  Users: GetUserDto;
}
export class GetGroupDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => GetTopicDto)
  Topics: GetTopicDto;

  @Expose()
  @Type(() => UserGroups)
  UserGroups: UserGroups[];
}
