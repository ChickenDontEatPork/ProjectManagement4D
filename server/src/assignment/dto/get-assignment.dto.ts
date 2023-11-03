import { GetCommentAssignmentsDto } from '@/comments-assign/dto/get-assign-comment.dto';
import { AssignmentStatus } from '@/shared/enums/status.enum';
import { GetUserDto } from '@/user/dto/get-user.dto';
import { Exclude, Expose, Type } from 'class-transformer';

class Tags {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

class Topics {
  @Expose()
  id: string;

  @Exclude()
  tagId: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => Tags)
  Tags: Tags;
}

class Groups {
  @Expose()
  id: string;

  @Expose()
  @Type(() => Topics)
  Topics: Topics;
}
export class AssignmentSubmitFiles {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  bucket: string;
}

export class AssignmentSubmit {
  @Expose()
  id: string;

  @Expose()
  status: AssignmentStatus;

  @Expose()
  createAt: Date;

  @Expose()
  modifyAt: Date;

  @Expose()
  @Type(() => AssignmentSubmitFiles)
  AssignmentSubmitFiles: AssignmentSubmitFiles[];

  @Expose()
  @Type(() => Groups)
  Groups: Groups;
}
export class Assignments {
  @Expose()
  @Type(() => AssignmentSubmit)
  AssignmentSubmit: AssignmentSubmit[];
}
export class AssignmentGroups {
  @Expose()
  @Type(() => Groups)
  Groups: Groups;

  @Expose()
  @Type(() => Assignments)
  Assignments: Assignments;
}
export class AssignmentFiles {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  bucket: string;

  @Expose()
  createAt: Date;
}
export class GetAssignmentDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  createAt: Date;

  @Expose()
  dueAt: Date;

  @Expose()
  @Type(() => AssignmentGroups)
  AssignmentGroups: AssignmentGroups[];

  @Expose()
  @Type(() => GetUserDto)
  Users: GetUserDto;

  @Expose()
  @Type(() => GetCommentAssignmentsDto)
  CommentAssignments: GetCommentAssignmentsDto[];

  @Expose()
  @Type(() => AssignmentFiles)
  AssignmentFiles: AssignmentFiles[];
}
