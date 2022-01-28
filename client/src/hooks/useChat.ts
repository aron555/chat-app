import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { ContentType, Message } from '../store/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { incrementChatUnreadMessagesCounter } from '../store/chats';
import { addMessageToCurrentChat } from '../store/chat';

const WS_SERVER_HOST: string = process.env.REACT_APP_WS_SERVER_HOST || 'http://localhost:7777';

export type SendMessage = (content: string, contentType: ContentType) => boolean;

export const useChat = () => {
  const user = useSelector((state: RootState) => state.auth);
  const chat = useSelector((state: RootState) => state.chat.chat);
  const dispatch = useDispatch();

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user.isLogged || !user?.user) return;

    socketRef.current = io(WS_SERVER_HOST);

    socketRef.current.emit('user:join', {
      token: localStorage.getItem('token'),
    });

    return () => {
      // @ts-ignore
      socketRef.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!chat?.id || !socketRef?.current) return;

    console.log('chat switched to', chat.id);

    socketRef.current.on('message', (message: Message) => {
      console.log('got message from server', { message, chat });

      if (chat?.id && message.chatId === chat.id) {
        dispatch(addMessageToCurrentChat({ message }));
      } else {
        message?.chatId && dispatch(incrementChatUnreadMessagesCounter({ chatId: message.chatId }));
      }
    });

    return () => {
      if (!socketRef?.current) return;
      socketRef.current.removeAllListeners('message');
    };
  }, [socketRef, chat]);

  const sendMessage: SendMessage = (content, contentType = ContentType.Text) => {
    if (!user.isLogged || !user?.user) return false;
    if (!chat?.id) return false;

    // @ts-ignore
    socketRef.current.emit('message:send', {
      userId: user.user.id,
      chatId: chat.id,
      content,
      contentType,
    });

    return true;
  };

  return { sendMessage };
};
