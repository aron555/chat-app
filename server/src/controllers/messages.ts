export const formatMessage = (userId: string, chatId: string, content: string, contentType: number) => {
  return {
    id: Math.floor(Math.random() + 100 * 9999),
    userId,
    chatId,
    content,
    contentType,
    createdAt: Date.now() / 1000,
  };
}
