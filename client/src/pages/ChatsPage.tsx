import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getUserChatsByToken } from '../store/chats';

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: '100%', backgroundColor: '#eee' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: string) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const ChatsPage: FC = () => {
  const dispatch = useDispatch();
  const chatsState = useSelector((state: RootState) => state.chats);

  const [selectedChat, setSelectedChat] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return;

    dispatch(getUserChatsByToken({ token }));
  }, []);

  const handleChange = (event: SyntheticEvent, newChatId: string) => {
    setSelectedChat(newChatId);
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', width: '100%', height: '100vh' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedChat}
        onChange={handleChange}
        sx={{ borderRight: 1, width: 'max(200px, 20%)', borderColor: 'divider' }}
      >
        {chatsState?.chats && chatsState.chats.map((chat) => {
          return <Tab key={chat.id} label={chat.name} {...a11yProps(chat.id)} />;
        })}
      </Tabs>
      {chatsState?.chats && chatsState.chats.map((chat) => {
        return (<TabPanel key={chat.id} value={selectedChat} index={chat.id}>
          {chat.name}
        </TabPanel>)
      })}
    </Box>
  );
};

export default ChatsPage;
