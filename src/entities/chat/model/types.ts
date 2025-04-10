export interface IMessage {
  id: string;
  chatId: string;
  message: string;
  authorId: string;
  createdAt: number;
  isRead: boolean;
  status: 'sending' | 'sent' | 'read';
}

export type TImages = {
  id: number;
  image: string;
  messageId: number;
};

export interface Reactions {
  reaction: string;
  count: number;
}

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: number;
  group: boolean;
  image?: string;
  lastMessageAuthorId?: string;
  participants: string[];
  projectId?: string;
}
