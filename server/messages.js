function formatMessage(userId, chatId, content) {
  return {
    userId,
    chatId,
    content,
    contentType: 0,
    date: Date.now(),
  };
}

module.exports = formatMessage;
