import { getUserChatsByToken } from '../api/chats';
import { Socket } from 'socket.io';

export const subscribeToUserChats = async ({
  token,
  socket,
}: {
  token: string;
  socket: Socket;
}) => {
  const chats = await getUserChatsByToken({ token });

  if (!chats?.length) return;

  for (let i = 0; i < chats.length; i++) {
    const chat = chats[i];

    socket.join(chat.id);
  }
};
