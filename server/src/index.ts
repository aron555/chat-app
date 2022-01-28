import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { userSignIn, getUserById, userLeave } from './controllers/users';
import { formatMessage } from './controllers/messages';
import cors from 'cors';
import { Message, UserJoin } from './types';
import dotenv from 'dotenv';
import { subscribeToUserChats } from './controllers/chats';

dotenv.config();

export const API_URL = process.env.API_URL || 'http://chat.test';

const app = express();
app.use(cors({ origin: '*' }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('user:join', async ({ token }: UserJoin) => {
    const user = await userSignIn(socket.id, token);

    if (!user) {
      console.log('user:join | Empty user object', { user, token });

      return socket.disconnect();
    }

    console.log('user:join', user);

    // Join all user chats
    await subscribeToUserChats({ token, socket });
  });

  socket.on('message:send', (message: Message) => {
    const user = getUserById(socket.id);

    if (!user) {
      console.log('message:send | User not found');

      return;
    }

    console.log('message:send', { user, message });

    io.to(message.chatId).emit(
      'message',
      formatMessage(user.id, message.chatId, message.content, message.contentType)
    );
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    console.log('disconnect', { user });
  });
});

const PORT = process.env.PORT || 7777;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
