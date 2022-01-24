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
