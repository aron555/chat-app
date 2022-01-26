function formatMessage(userId, chatId, content, contentType) {
  return {
    userId,
    chatId,
    content,
    contentType,
    date: Date.now(),
  };
}

module.exports = formatMessage;
