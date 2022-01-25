import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import { Container } from '@mui/material';
import ChatPage from './pages/ChatPage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import SignUpPage from './pages/SignUpPage';
import { getUserInfoByToken } from './store/auth';
import ChatsPage from './pages/ChatsPage';

function App() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      dispatch(getUserInfoByToken({ token }));
    }
  }, []);

  if (!auth.isLogged) {
    return (
      <Container>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<div>Home page for not authorized users</div>} />
            <Route path="auth">
              <Route path="sign-in" element={<SignInPage />} />
              <Route path="sign-up" element={<SignUpPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </BrowserRouter>
      </Container>
    );
  }

  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="auth">
            <Route path="logout" element={<div>Logout</div>} />
          </Route>
          <Route path="chats">
            <Route path="create" element={<div>Create chat</div>} />
            <Route path=":chatId">
              <Route path="details" element={<div>Chat details</div>} />
              <Route path="participants" element={<div>Chat participants</div>} />
              <Route index element={<ChatsPage />} />
            </Route>
            <Route index element={<ChatsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/chats" replace={true} />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
