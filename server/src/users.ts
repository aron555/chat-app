const users: any[] = [];

// Join user to chat
const userJoin = (id: string, token: string, userId: string, chatId: string) => {
  // TODO: Verify token here and if ok add use

  if (!token) {
    console.log('token invalid');

    return false;
  }

  const user = { id, userId, chatId };

  users.push(user);

  return user;
}

// Get current user
const getCurrentUser = (id: string) => {
  return users.find((user) => user.id === id);
}

// User leaves chat
const userLeave = (id: string) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

export {
  userJoin,
  getCurrentUser,
  userLeave,
};
