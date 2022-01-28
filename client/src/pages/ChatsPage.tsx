import React, { FC, useEffect } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  Avatar,
  Chip,
  Badge,
  IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getUserChatsByToken } from '../store/chats';
import { Link, useParams } from 'react-router-dom';
import ChatPage from './ChatPage';
import { ArrowRight, Settings } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
}

function TabPanel(props: TabPanelProps) {
  const { children, ...other } = props;

  return (
    <div role="tabpanel" style={{ width: '100%', backgroundColor: '#e6ebee' }} {...other}>
      <Box sx={{ height: '100vh', borderRight: 1, borderColor: 'divider' }}>{children}</Box>
    </div>
  );
}

const ChatsPage: FC = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chats);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return;

    dispatch(getUserChatsByToken({ token }));
  }, []);

  if (chats.isLoading) {
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
    <Box sx={{ flexGrow: 1, display: 'flex', width: '100%', height: '100vh' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={chatId || ''}
        sx={{
          borderLeft: 1,
          borderRight: 1,
          width: 'max(400px, 20%)',
          borderColor: 'divider',
          padding: 0,
        }}
      >
        <Tab
          value={''}
          sx={{ alignItems: 'flex-start', padding: 0, borderBottom: 1, borderColor: 'divider' }}
          label={
            <Link
              to={`/chats`}
              style={{
                textDecoration: 'none',
                color: '#000',
                textAlign: 'left',
                textTransform: 'none',
                padding: '12px 16px',
                width: '100%',
              }}
            >
              {user && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Avatar src={user.profileImage || undefined} />
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ ml: '8px' }}>
                      {user.fullname || `@${user.username}`}
                    </Typography>
                    <IconButton
                      size="large"
                      sx={{
                        '& svg': {
                          color: 'rgba(0,0,0,0.8)',
                          transition: '0.2s',
                          transform: 'translateX(0) rotate(0)',
                        },
                        '&:hover, &:focus': {
                          bgcolor: 'unset',
                          '& svg:first-of-type': {
                            transform: 'translateX(-4px) rotate(-20deg)',
                          },
                          '& svg:last-of-type': {
                            right: 0,
                            opacity: 1,
                          },
                        },
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          height: '80%',
                          display: 'block',
                          left: 0,
                          width: '1px',
                          bgcolor: 'divider',
                        },
                        mr: '16px',
                      }}
                    >
                      <Settings />
                      <ArrowRight sx={{ position: 'absolute', right: 4, opacity: 0 }} />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Link>
          }
        />
        {chats?.chats &&
          chats.chats.map((chat) => {
            return (
              <Tab
                key={chat.id}
                value={chat.id}
                sx={{ alignItems: 'flex-start', padding: 0 }}
                label={
                  <Link
                    to={`/chats/${chat.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'unset',
                      textAlign: 'left',
                      textTransform: 'none',
                      padding: '16px 16px',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Badge badgeContent={chat?.unreadMessagesCount} color="primary">
                        <Avatar />
                      </Badge>
                      <Typography sx={{ ml: '8px' }}>{chat.name}</Typography>
                    </Box>
                  </Link>
                }
              />
            );
          })}
      </Tabs>
      {chatId === '' || !chatId ? (
        <TabPanel>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
          >
            <Chip label="Select a chat to start messaging" />
          </Box>
        </TabPanel>
      ) : (
        <TabPanel>{chatId && <ChatPage chatId={chatId} />}</TabPanel>
      )}
    </Box>
  );
};

export default ChatsPage;
