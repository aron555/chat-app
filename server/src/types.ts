export interface UserJoin {
  token: string;
}

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
  chatId: string;
  content: string;
  contentType: ContentType;
  createdAt: number;
}

export interface ApiResponse<Type> {
  data?: Type & { error?: Message };
  statusCode?: number;
}

export type GetUserInfoByTokenResponse = ApiResponse<{ user: User }>;

export type GetUserChatsResponse = ApiResponse<{ chats: Chat[] }>;
