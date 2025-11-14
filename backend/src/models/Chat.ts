import { Message } from './Message';
import { User } from './User';

export interface ChatUser {
  id: string;
  userId: string;
  chatId: string;
  nickname: string;
  user: User;
  chat: Chat;
}

export interface Chat {
  id: string;
  messages: Message[];
  chatUsers: ChatUser[];
}
