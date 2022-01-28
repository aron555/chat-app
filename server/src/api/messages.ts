import axios from 'axios';
import { API_URL } from '../index';
import { AddMessageToChatResponse, Message } from '../types';

export const addMessageToChat = async ({
  token,
  chatId,
  message,
}: {
  token: string;
  chatId: string;
  message: Pick<Message, 'content' | 'contentType'>;
}): Promise<string> => {
  const sentMessage = await axios.post<AddMessageToChatResponse>(
    API_URL + `/api/chats/${chatId}/messages`,
    message,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = sentMessage.data.data;

  if (!data?.message) throw new Error('Failed to add message');

  return data.createdMessageId;
};
