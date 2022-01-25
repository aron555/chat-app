export interface Message {
  user: User;
  message: string;
  date: number;
}

export interface User {
  id: string;
  username: string;
  fullname: string;
  profileImage: string;
  description: string;
}

export interface ApiResponse<Type> {
  data?: Type & { error?: message };
  statusCode?: number;
}

export type SignInResponse = ApiResponse<{ jwt: string }>;

export type GetUserInfoByTokenResponse = ApiResponse<{ user: User }>;
