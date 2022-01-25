function formatMessage(userId, chatId, content) {
  return {
    userId,
    chatId,
    content,
    date: Date.now(),
  };
}

module.exports = formatMessage;
