import React, { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { SendMessage } from '../../hooks/useChat';
import SendIcon from '@mui/icons-material/Send';
import { ContentType } from '../../store/types';

export interface MessageFormProps {
  sendMessage: SendMessage;
}

const MessageForm: FC<MessageFormProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState('');
  const messageRef = useRef<HTMLInputElement>(null);

  const handleChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!message.length) return;

    const messageSent = sendMessage(message, ContentType.Text);

    if (!messageSent) return alert('Failed to send message, try again');

    setMessage('');

    messageRef?.current?.focus();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Stack spacing={1} direction="row">
        <TextField
          placeholder="Message"
          value={message}
          onChange={handleChangeMessage}
          // multiline
          minRows={1}
          maxRows={5}
          autoComplete="off"
          fullWidth
          autoFocus
          ref={messageRef}
          sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
        />
        <Button variant="contained" type="submit" disableElevation>
          <SendIcon />
        </Button>
      </Stack>
    </form>
  );
};

export default MessageForm;
