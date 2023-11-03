import { AssignmentStatus } from '@/enums/status.enum';
export interface Task {
  topic: string;
  status: AssignmentStatus;
  deadline: Date;
}

export interface Assignments {
  id: string;
  title: string;
  description: string;
  createAt: string;
  dueAt: string;
  AssignmentGroups: AssignmentGroup[];
  Users: User;
  CommentAssignments: CommentAssignment[];
}

export interface AssignmentGroup {
  Groups: Groups;
  Assignments: Assignments;
}

export interface Groups {
  id: string;
  Topics: Topics;
}

export interface Topics {
  id: string;
  name: string;
  description: string;
  Tags: Tags;
}

export interface Tags {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  image: string;
  name: any;
  lastname: any;
  tel: any;
  role: string;
  register: boolean;
}

export interface CommentAssignment {
  id: string;
  description: string;
  Users: User;
  createAt: string;
}
