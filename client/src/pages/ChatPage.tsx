import React, { FC, useEffect, useMemo, useRef } from 'react';
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
import { getChatInfo, getChatMessages } from '../store/chat';
import MessageForm from '../components/Messages/MessageForm';
import { resetChatUnreadMessagesCounter } from '../store/chats';

export interface ChatPageProps {
  chatId: string;
}

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef?.current) return;

    elementRef.current.scrollIntoView();
  });

  return <div ref={elementRef} />;
};

const ChatPage: FC<ChatPageProps> = ({ chatId }) => {
  const chat = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const { messages, sendMessage } = useChat(chatId);

  useMemo(() => {
    const token = localStorage.getItem('token');

    if (!token || !chatId?.length) return;

    console.log('get chat messages', chatId);

    dispatch(getChatInfo({ token, chatId }));
    dispatch(getChatMessages({ token, chatId }));
    dispatch(resetChatUnreadMessagesCounter({ chatId }));
  }, [chatId]);

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
    <Box sx={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          height: '64px',
          minHeight: '64px',
          backgroundColor: '#fff',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ml: '16px' }}>
          <Avatar src={chat.chat?.image || undefined} />
          <Typography sx={{ ml: '8px' }}>{chat.chat?.name}</Typography>
        </Box>
      </Box>
      <Box className="chatMessagesContainer" sx={{ height: '100%', overflow: 'hidden auto' }}>
        <Stack spacing={2} sx={{ m: 1 }}>
          {chat?.messages &&
            [...chat.messages, ...messages].map((message: Message) => (
              <Card
                key={message.id}
                sx={{
                  width: 'min(400px, 100%)',
                  alignSelf: user?.id === message?.user?.id ? 'end' : 'start',
                }}
              >
                <CardHeader
                  avatar={<Avatar src={message?.user?.profileImage} />}
                  title={message?.user?.fullname || message?.user?.username}
                  subheader={`${new Date(
                    message.createdAt * 1000
                  ).toLocaleDateString()} at ${new Date(
                    message.createdAt * 1000
                  ).toLocaleTimeString()}`}
                />
                {+message.contentType === ContentType.Image && (
                  <CardMedia component="img" image={message.content} />
                )}
                {+message.contentType === ContentType.Text && (
                  <CardContent>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>
                  </CardContent>
                )}
              </Card>
            ))}
          <AlwaysScrollToBottom />
        </Stack>
      </Box>
      <Box sx={{ p: 1 }}>
        <MessageForm sendMessage={sendMessage} />
      </Box>
    </Box>
  );
};

export default ChatPage;
