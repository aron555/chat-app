import React, { FC, useRef } from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { Message } from '../store/types';

const ChatPage: FC = () => {
  const { chatId } = useParams();
  const { messages, sendMessage } = useChat(chatId);
  const messageRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!messageRef.current) return;

    const value = messageRef.current.value;

    if (!value.length) return;

    sendMessage(value);
  }

  return (
    <Box>
      {messages.map((message: Message) => <div key={message.date}>{message.message}</div>)}
      <input ref={messageRef} />
      <button onClick={handleSendMessage}>Send</button>
    </Box>
  );
};

export default ChatPage;
