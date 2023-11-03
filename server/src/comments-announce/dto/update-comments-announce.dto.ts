import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentsAnnounceDto } from './create-comments-announce.dto';

export class UpdateCommentsAnnounceDto extends PartialType(
  CreateCommentsAnnounceDto,
) {}
