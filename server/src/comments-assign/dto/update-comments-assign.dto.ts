import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentsAssignDto } from './create-comments-assign.dto';

export class UpdateCommentsAssignDto extends PartialType(
  CreateCommentsAssignDto,
) {}
