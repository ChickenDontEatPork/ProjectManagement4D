export interface Groups {
  id: string;
  title: string;
  description: string;
  createAt: string;
  dueAt: string;
  AssignmentGroups: AssignmentGroup[];
  Users: Users;
  CommentAssignments: any[];
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
  AssignmentSubmit: any[];
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
