import { GetUserDto } from '@/user/dto/get-user.dto';
import { Expose, Type } from 'class-transformer';

export class Groups {
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserGroups)
  UserGroups: UserGroups[];
}

export class UserGroups {
  @Expose()
  @Type(() => GetUserDto)
  Users: GetUserDto;
}

export class AdvisorTopic {
  @Expose()
  advisorId: string;

  @Expose()
  priority: number;

  @Expose()
  @Type(() => GetUserDto)
  Users: GetUserDto;
}

export class Tag {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class GetTopicDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => AdvisorTopic)
  AdvisorTopic: AdvisorTopic[];

  @Expose()
  @Type(() => Tag)
  Tag: Tag;

  @Expose()
  @Type(() => Groups)
  Groups: Groups | null;
}
