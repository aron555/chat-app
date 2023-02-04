import axios from "axios";
import { Chat, GetUserChatsResponse } from "../types";
import { API_URL } from "../index";

export const getUserChatsByToken = async ({ token }: { token: string }): Promise<Chat[]> => {
  const userChats = await axios.get<GetUserChatsResponse>(API_URL + '/api/users/me/chats', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = userChats.data.data;

  if (!data?.chats) throw new Error();

  return data.chats;
};
