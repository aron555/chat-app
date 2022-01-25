import React, { FC, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getUserChatsByToken } from '../store/chats';
import { Link, useParams } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
}

function TabPanel(props: TabPanelProps) {
  const { children, ...other } = props;

  return (
    <div role="tabpanel" style={{ width: '100%', backgroundColor: '#eee' }} {...other}>
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    </div>
  );
}

const ChatsPage: FC = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const chatsState = useSelector((state: RootState) => state.chats);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return;

    dispatch(getUserChatsByToken({ token }));
  }, []);

  if (chatsState.isLoading) {
    return <CircularProgress color="inherit" />;
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', width: '100%', height: '100vh' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={chatId || ''}
        sx={{ borderRight: 1, width: 'max(300px, 20%)', borderColor: 'divider' }}
      >
        {chatsState?.chats &&
          chatsState.chats.map((chat) => {
            return (
              <Tab
                key={chat.id}
                value={chat.id}
                sx={{ alignItems: 'flex-start' }}
                label={
                  <Link
                    to={`/chats/${chat.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'unset',
                      textAlign: 'left',
                      textTransform: 'none',
                    }}
                  >
                    {chat.name}
                  </Link>
                }
              />
            );
          })}
      </Tabs>
      <TabPanel>{chatId}</TabPanel>
    </Box>
  );
};

export default ChatsPage;
