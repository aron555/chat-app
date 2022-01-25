import React, {FC, useMemo, useRef} from 'react';
import {Box, CircularProgress} from '@mui/material';
import { useChat } from '../hooks/useChat';
import { Message } from '../store/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getChatMessages } from '../store/chat';

export interface ChatPageProps {
  chatId: string;
}

const ChatPage: FC<ChatPageProps> = ({ chatId }) => {
  const chat = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const { messages, sendMessage } = useChat(chatId);
  const messageRef = useRef<HTMLInputElement>(null);

  useMemo(() => {
    console.log('get messages');

    const token = localStorage.getItem('token');

    if (!token) return;

    // FIXME: Circular loop here
    // dispatch(getChatMessages({ token, chatId }));
  }, [chatId]);

  const handleSendMessage = () => {
    if (!messageRef.current) return;

    const value = messageRef.current.value;

    if (!value.length) return;

    sendMessage(value);
  };

  if (chat.isLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box>
      {chat.messages && chat.messages.map((message: Message) => (
        <div key={message.date}>{message.userId}: {message.content}</div>
      ))}
      {/*{messages.map((message: Message) => (*/}
      {/*  <div key={message.date}>{message.message}</div>*/}
      {/*))}*/}
      <input ref={messageRef} />
      <button onClick={handleSendMessage}>Send</button>
    </Box>
  );
};

export default ChatPage;
