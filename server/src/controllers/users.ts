import { getUserInfoByToken } from '../api/users';
import { User } from '../types';

const users: any[] = [];

export const userSignIn = async (id: string, token: string): Promise<User | undefined> => {
  const userInfo = await getUserInfoByToken({ token });

  if (!userInfo) {
    throw new Error('Failed to get user info');
  }

  const user = { ...userInfo, id, userId: userInfo.id, token };

  users.push(user);

  return user;
};

export const getUserById = (id: string) => {
  return users.find((user) => user.id === id);
};

export const userLeave = (id: string) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
