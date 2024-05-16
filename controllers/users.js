const User = require("../models/user");
const {
  invalidDataError,
  notFoundError,
  defaultError,
} = require("../utils/errors");

/* GET all users */
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

/* POST Create User */
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(invalidDataError.status)
          .send({ message: invalidDataError.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

/* GET user by id */
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User Id Not Found");
      error.status = notFoundError.status;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "") {
        // return res.status(400).send({ message: err.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

module.exports = { getUsers, createUser, getUser };
