import { tokens } from './tokens.interface';

export interface GetAssignId {
  assignId?: string;
  token?: string | undefined;
}

export interface GetAssign {
  page?: string | undefined;
  search?: string | undefined;
  token?: string | undefined;
}

export interface GetAssignSubmitId {
  assignSummitId?: string;
  token?: tokens;
}

export interface PostAssignSubmit {
  assignmentId: string;
  files: FormData;
  token?: tokens;
}

export interface Assignments {
  data: Assignment[];
  meta: Meta;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  createAt: string;
  dueAt: string;
  AssignmentGroups: AssignmentGroup[];
  Users: Users;
  CommentAssignments: CommentAssignment[];
  AssignmentFiles: any[];
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

export interface Assignments {
  AssignmentSubmit: AssignmentSubmit[];
}

export interface AssignmentSubmit {
  id: string;
  status: string;
  createAt: string;
  modifyAt: string;
  AssignmentSubmitFiles: AssignmentSubmitFile[];
  Groups: {
    id: string;
  };
}

export interface AssignmentSubmitFile {
  id: string;
  name: string;
  bucket: string;
}

export interface Users {
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
  Users: Users2;
  createAt: string;
}

export interface Users2 {
  id: string;
  email: string;
  image: string;
  name: any;
  lastname: any;
  tel: any;
  role: string;
  register: boolean;
}

export interface Meta {
  total: number;
  lastPage: number;
  currentPage: any;
  perPage: number;
  prev: any;
  next: any;
}
