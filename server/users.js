const users = [];

// Join user to chat
function userJoin(id, token, userId, chatId) {
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
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
};