import {ImageSourcePropType} from 'react-native';

import {userState} from 'redux/slices/userSlice';

export interface IMessage {
  id: string;
  chatId: string;
  message: string;
  authorId: string;
  createdAt: Date;
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
  participants: string[];
}
