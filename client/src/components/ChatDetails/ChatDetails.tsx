import React, { FC, useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';
import TransitionsModal from '../Modal/TransitionsModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { User } from '../../store/types';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const ChatDetails: FC = () => {
  const chat = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth.user);
  const [chatDetailsShown, setChatDetailsShown] = useState<boolean>(false);

  const handleShowDetails = () => {
    setChatDetailsShown(true);
  };

  const handleCloseDetails = () => {
    setChatDetailsShown(false);
  };

  return (
    <>
      <Box
        onClick={handleShowDetails}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          ml: '16px',
        }}
      >
        <Avatar src={chat.chat?.image || undefined} />
        <Typography sx={{ ml: '8px' }}>{chat.chat?.name}</Typography>
      </Box>
      <TransitionsModal open={chatDetailsShown} handleClose={handleCloseDetails}>
        <Box>
          <Box sx={{mb: 2, display: 'flex', flexDirection: 'row'}}>
            <Box>
              <Avatar
                src={chat?.chat?.image || undefined}
                sx={{ width: '100px', height: '100px' }}
              />
            </Box>
            <Box sx={{ml: '16px', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
              <Typography variant="subtitle1">{chat?.chat?.name}</Typography>
              <Typography variant="subtitle2" sx={{color: 'text.secondary'}}>{chat?.participants?.length} participants</Typography>
            </Box>
          </Box>
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Chat participants
              </ListSubheader>
            }
          >
            {chat.participants &&
              chat.participants.map((participant: User) => {
                return (
                  <ListItem
                    key={participant.id}
                    sx={{ px: 0 }}
                    secondaryAction={
                      participant.id !== user?.id && (
                        <IconButton edge="end">
                          <DeleteOutlineIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={participant?.profileImage || undefined} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={participant?.fullname || `@${participant?.username}`}
                      secondary={participant?.fullname && `@${participant?.username}`}
                    />
                  </ListItem>
                );
              })}
          </List>
        </Box>
      </TransitionsModal>
    </>
  );
};

export default ChatDetails;
