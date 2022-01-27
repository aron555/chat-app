export const formatMessage = (userId: string, chatId: string, content: string, contentType: number) => {
  return {
    userId,
    chatId,
    content,
    contentType,
    date: Date.now(),
  };
}
