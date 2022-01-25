export interface User {
  id: string;
  username: string;
  fullname: string;
  profileImage: string;
  description: string;
}

export interface Chat {
  id: string;
  image: string;
  name: string;
}

export enum ContentType {
  Text,
  Image,
  Video,
  Sticker,
}

export interface Message {
  id: string;
  userId: string;
  user?: User;
  chatId: string;
  content: string;
  contentType: ContentType;
  createdAt: string;
}

export interface ApiResponse<Type> {
  data?: Type & { error?: Message };
  statusCode?: number;
}

export const API_HOST = process.env.REACT_APP_API_HOST || 'http://chat.test';

export type SignInResponse = ApiResponse<{ jwt: string }>;

export type GetUserInfoByTokenResponse = ApiResponse<{ user: User }>;

export type GetUserChatsResponse = ApiResponse<{ chats: Chat[] }>;

export type GetChatMessages = ApiResponse<{ messages: Message[] }>;
