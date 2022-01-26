import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { ContentType, Message } from '../store/types';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const SERVER_HOST: string = process.env.REACT_APP_WS_SERVER_HOST || 'http://localhost:7777';

export const useChat = (chatId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useSelector((state: RootState) => state.auth);
  const chats = useSelector((state: RootState) => state.chats);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user.isLogged || !user?.user) return;
    if (chats.isLoading || !chats?.chats) return;

    socketRef.current = io(SERVER_HOST);

    // socketRef.current.emit('chat:join', { userId: user.user.id, token: 'token', chatId });

    // Join every chat user participate in
    for (const chat of chats.chats) {
      socketRef.current.emit('chat:join', {
        userId: user.user.id,
        token: 'token',
        chatId: chat.id,
      });
    }

    // socketRef.current.on('users', (users) => {
    //   setUsers(users);
    // });

    socketRef.current.on('message', (message: Message) => {
      console.log('got message from server', message);

      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      // @ts-ignore
      socketRef.current.disconnect();
    };
  }, [chats, user]);

  const sendMessage = (messageText: string) => {
    if (!user.isLogged || !user?.user) return;

    // @ts-ignore
    socketRef.current.emit('message:send', {
      userId: user.user.id,
      chatId: chatId,
      content: messageText,
      contentType: ContentType.Text,
    });
  };

  return { messages, sendMessage };
};
