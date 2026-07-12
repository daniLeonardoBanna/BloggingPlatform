export interface AuthorSummary {
  id: string;
  username: string;
  displayName: string;
}

export type PostStatus = "draft" | "published" | "archived";

export interface PostResponse {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  commentCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorBot: AuthorSummary;
}

export interface CommentResponse {
  id: string;
  postId: string;
  parentCommentId?: string;
  content: string;
  depth: number;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  authorBot: AuthorSummary;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}
