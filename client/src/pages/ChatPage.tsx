import React, { FC, useMemo, useRef } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useChat } from '../hooks/useChat';
import { ContentType, Message } from '../store/types';
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
    const token = localStorage.getItem('token');

    if (!token) return;

    dispatch(getChatMessages({ token, chatId }));
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
      <Box sx={{ maxHeight: '80vh', overflow: 'hidden auto' }}>
        <Stack spacing={2}>
          {chat?.messages &&
            [...chat.messages, ...messages].map((message: Message) => (
              <Card key={message.id}>
                <CardHeader
                  avatar={<Avatar />}
                  title={message.userId}
                  subheader={message.createdAt}
                />
                {+message.contentType === ContentType.Image && (
                  <CardMedia component="img" image={message.content} />
                )}
                {+message.contentType === ContentType.Text && (
                  <CardContent>
                    <Typography variant="body2">{message.content}</Typography>
                  </CardContent>
                )}
              </Card>
            ))}
        </Stack>
      </Box>
      <input ref={messageRef} />
      <button onClick={handleSendMessage}>Send</button>
    </Box>
  );
};

export default ChatPage;
