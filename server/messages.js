function formatMessage(userId, message) {
  return {
    userId,
    message,
    date: Date.now(),
  };
}

module.exports = formatMessage;
