export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  threadCount: number;
  createdAt: string;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  userId: string;
  categoryId: string;
  views: number;
  replyCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForumReply {
  id: string;
  content: string;
  threadId: string;
  userId: string;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}
