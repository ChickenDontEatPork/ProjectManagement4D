import { GetCommentDto } from '@/comments-announce/dto/get-comments.dto';
import { Tag } from '@/topic/dto/get-topic.dto';
import { GetUserDto } from '@/user/dto/get-user.dto';
import { Expose, Type } from 'class-transformer';

export class AnnouncementFiles {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  bucket: string;
}

export class AnnouncementTag {
  @Expose()
  @Type(() => Tag)
  Tags: Tag;
}
export class GetAnnouncementDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  createAt: string;

  @Expose()
  modifyAt: string;

  @Expose()
  @Type(() => GetUserDto)
  Advisor: GetUserDto;

  @Expose()
  @Type(() => AnnouncementTag)
  AnnouncementTag: AnnouncementTag[];

  @Expose()
  @Type(() => AnnouncementFiles)
  AnnouncementFiles: AnnouncementFiles[];

  @Expose()
  @Type(() => GetCommentDto)
  CommentAnnoucements: GetCommentDto[];
}
