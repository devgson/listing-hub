const ErrorHandler = (message, status = 401) => {
  const error = new Error(message);
  error.status = status;
  return error;
}

module.exports = {
  ErrorHandler
}