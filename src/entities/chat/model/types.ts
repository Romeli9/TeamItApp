import {ImageSourcePropType} from 'react-native';

import {userState} from 'redux/slices/userSlice';

export interface IMessage {
  id: string;
  chatId: number;
  message: string;
  authorId: string;
  author: userState;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isSending?: boolean;
  isRead: boolean;
  hasError?: boolean;
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

export interface Participant {
  // user: User;
  chatId: number;
  userId: number;
}

export interface Chat {
  id: string;
  // productId: number;
  // product: Product;
  // messages: string[];
  // participants: Participant[];
}
