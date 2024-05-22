const invalidDataError = {
  status: 400,
  message: "Invalid data passed to the methods.",
};

const unauthorizedError = {
  status: 401,
  message: "Invalid Username or Password.",
};
const forbiddenError = {
  status: 403,
  message: "An authentication error has occurred.",
};

const notFoundError = {
  status: 404,
  message: "Server cannot find the requested.",
};

const conflictError = {
  status: 409,
  message: "Email already in use.",
};

const defaultError = {
  status: 500,
  message: "An error has occurred on the server.",
};

module.exports = {
  invalidDataError,
  notFoundError,
  defaultError,
  conflictError,
  unauthorizedError,
  forbiddenError,
};
