import axios from 'axios';
import { API_URL } from '../index';
import { GetUserInfoByTokenResponse, User } from '../types';

export const getUserInfoByToken = async ({ token }: { token: string }): Promise<User> => {
  const currentUser = await axios.get<GetUserInfoByTokenResponse>(API_URL + '/api/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = currentUser.data.data;

  if (!data?.user) throw new Error('Failed to get user info');

  const user = data.user;

  return user;
};
