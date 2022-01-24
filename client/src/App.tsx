import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { Container } from '@mui/material';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Index</div>} />
          <Route path="auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="sign-up" element={<div>Sign up</div>} />
            <Route path="logout" element={<div>Logout</div>} />
          </Route>
          <Route path="chats">
            <Route path="create" element={<div>Create chat</div>} />
            <Route path=":chatId">
              <Route path="details" element={<div>Chat details</div>} />
              <Route path="participants" element={<div>Chat participants</div>} />
              <Route index element={<ChatPage />} />
            </Route>
            <Route index element={<div>Chats list</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
