export interface Announcements {
  data: Announcement[];
  meta: Meta;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  createAt: string;
  modifyAt: string;
  Advisor: Advisor;
  AnnouncementTag: AnnouncementTag[];
  AnnouncementFiles: any[];
  CommentAnnoucements: CommentAnnoucement[];
}

export interface Advisor {
  id: string;
  email: string;
  image: string;
  name: any;
  lastname: any;
  tel: any;
  role: string;
  register: boolean;
}

export interface AnnouncementTag {
  Tags: Tags;
}

export interface Tags {
  id: string;
  name: string;
}

export interface Meta {
  total: number;
  lastPage: number;
  currentPage: any;
  perPage: number;
  prev: any;
  next: any;
}
export interface CommentAnnoucement {
  id: string;
  userId: string;
  annoucementId: string;
  description: string;
  createAt: string;
  Users: Users;
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

export interface FilesAnnounce {
  id: string;
  name: string;
  bucket: string;
  createAt: string;
}
