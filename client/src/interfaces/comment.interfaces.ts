export interface PostCommentAnnounce {
  userId?: string | undefined;
  annoucementId?: string | undefined;
  description: string;
  token?: string | undefined;
}

export interface GetCommentAnnounce {
  announceId?: string;
  token?: string | undefined;
}

export interface PostCommentAssign {
  userId?: string | undefined;
  assignmentId?: string | undefined;
  description: string;
  token?: string | undefined;
}

export interface GetCommentAssign {
  assignId?: string;
  token?: string | undefined;
}

export interface Paramcomment {
  token: string | undefined;
  userId: string | undefined;
}

export interface DeleteCommentAssign {
  commentAssignId?: string;
  token?: string | undefined;
}

export interface DeleteCommentAnnounce {
  commentAnnounceId?: string;
  token?: string | undefined;
}
