export const formatMessage = (user: any, message: any) => {
  return {
    id: Math.floor(100 + Math.random() * 9999),
    user: {
      id: user.userId,
      username: user.username,
      fullname: user.fullname,
      profileImage: user.profileImage
    },
    chatId: message.chatId,
    content: message.content,
    contentType: message.contentType,
    createdAt: Date.now() / 1000,
  };
}
