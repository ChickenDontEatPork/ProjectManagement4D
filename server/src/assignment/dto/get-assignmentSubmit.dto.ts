import { AssignmentStatus } from '@prisma/client';
import { AssignmentSubmit } from './get-assignment.dto';
import { Expose, Type } from 'class-transformer';

export class Tags {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class Topics {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  Tags: Tags;
}

export class Groups {
  @Expose()
  id: string;

  @Expose()
  @Type(() => Topics)
  Topics: Topics;
}

export class Assignments {
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
}

export class GetAssignmentSubmitDto {
  @Expose()
  id: string;

  @Expose()
  status: AssignmentStatus;

  @Expose()
  createAt: Date;

  @Expose()
  modifyAt: Date;

  @Expose()
  Groups: Groups;

  @Expose()
  @Type(() => AssignmentSubmit)
  AssignmentSubmitFiles: AssignmentSubmit;

  @Expose()
  @Type(() => Assignments)
  Assignments: Assignments;
}
