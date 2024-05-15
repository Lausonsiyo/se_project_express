const invalidDataError = {
  status: 400,
  message: "Invalid data passed to the methods.",
};

const notFoundError = {
  status: 404,
  message: "Server cannot find the requested.",
};

const defaultError = {
  status: 500,
  message: "An error has occurred on the server.",
};

module.exports = {
  invalidDataError,
  notFoundError,
  defaultError,
};
