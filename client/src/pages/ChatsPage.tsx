import React, { FC, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, CircularProgress, Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getUserChatsByToken } from '../store/chats';
import { Link, useParams } from 'react-router-dom';
import ChatPage from './ChatPage';

interface TabPanelProps {
  children?: React.ReactNode;
}

function TabPanel(props: TabPanelProps) {
  const { children, ...other } = props;

  return (
    <div role="tabpanel" style={{ width: '100%', backgroundColor: '#eee' }} {...other}>
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
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
        sx={{ borderRight: 1, width: 'max(350px, 20%)', borderColor: 'divider', padding: 0 }}
      >
        <Tab
          value={''}
          sx={{ alignItems: 'flex-start', padding: 0 }}
          label={
            <Link
              to={`/chats`}
              style={{
                textDecoration: 'none',
                color: 'unset',
                textAlign: 'left',
                textTransform: 'none',
                padding: '12px 16px',
                width: '100%',
              }}
            >
              {user && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Avatar src={user.profileImage || undefined} />
                  <Typography sx={{ ml: '8px' }}>{user.fullname || `@${user.username}`}</Typography>
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
                      padding: '12px 16px',
                      width: '100%',
                    }}
                  >
                    {chat.name}
                  </Link>
                }
              />
            );
          })}
      </Tabs>
      {chatId === '' || !chatId ? (
        <TabPanel>Select a chat to start messaging</TabPanel>
      ) : (
        <TabPanel>{chatId && <ChatPage chatId={chatId} />}</TabPanel>
      )}
    </Box>
  );
};

export default ChatsPage;
