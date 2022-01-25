import React, { FC, useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { signUp } from '../store/auth';

const SignUpPage: FC = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (!username.length || !password.length) return;

    dispatch(signUp({ username, password }));
  };

  return (
    <>
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <Stack spacing={2} sx={{ width: '300px' }}>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" size="large" type="submit" disableElevation>
              Sign up
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default SignUpPage;
