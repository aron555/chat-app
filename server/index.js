const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { userJoin, getCurrentUser, userLeave } = require('./users');
const formatMessage = require('./messages');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // console.log({ socket });
  // console.log({ auth: socket.auth });

  socket.on('chat:join', ({ token, userId, chatId }) => {
    // TODO:
    // 1. Check if user token ok
    // 2. Check if user can access chat

    const user = userJoin(socket.id, token, userId, chatId);

    if (!user) {
      return socket.disconnect();
    }

    socket.join(user.chatId);

    console.log('chat:join', { user });

    // Broadcast when a user connects
    // socket.broadcast
    //     .to(user.chatId)
    //     .emit(
    //         'message',
    //         formatMessage(botName, `${user.username} has joined the chat`)
    //     );

    // Send users and room info
    // io.to(user.chatId).emit('roomUsers', {
    //     room: user.room,
    //     users: getRoomUsers(user.room)
    // });
  });

  socket.on('message:send', (message) => {
    const user = getCurrentUser(socket.id);

    if (!user) {
      console.log('user not authorized');

      return;
    }

    console.log('message:send', { user, message });

    io.to(user.chatId).emit('message', formatMessage(user.userId, message.chatId, message.content, message.contentType));
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    console.log('disconnect', { user });

    // if (user) {
    //   console.log('disconnect: user exists, set status to offline');
    //
    //   io.to(user.chatId).emit(
    //     'message',
    //     formatMessage(botName, `${user.username} has left the chat`)
    //   );
    // }
  });
});

const PORT = process.env.PORT || 7777;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
