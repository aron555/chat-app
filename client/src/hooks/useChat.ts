import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { Message } from '../store/types';

const SERVER_HOST: string = process.env.REACT_APP_WS_SERVER_HOST || 'http://localhost:7777';

export const useChat = (chatId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const user = { id: `user_${Date.now()}` };

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SERVER_HOST);

    socketRef.current.emit('chat:join', { userId: user.id, token: 'token', chatId });

    // socketRef.current.on('users', (users) => {
    //   setUsers(users);
    // });

    socketRef.current.on('message', (message: Message) => {
      console.log('got message from server', message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      // @ts-ignore
      socketRef.current.disconnect();
    };
  }, [chatId]);

  const sendMessage = (messageText: string) => {
    // @ts-ignore
    socketRef.current.emit('message:send', {
      userId: user.id,
      message: messageText,
    });
  };

  return { messages, sendMessage };
};
