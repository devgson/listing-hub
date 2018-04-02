const ErrorHandler = (message, status = 401) => {
  const error = new Error(message);
  error.status = status;
  return error;
}

<<<<<<< HEAD

=======
>>>>>>> 4c8a0d7436b9ab5a2cd60b12679389def36faa0a
module.exports = {
  ErrorHandler
}