const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  invalidDataError,
  notFoundError,
  defaultError,
  unauthorizedError,
  conflictError,
} = require("../utils/errors");

/* POST Create User */
const createUser = (req, res) => {
  const { name, avatar, email } = req.body;

  if (!email) {
    return res
      .status(invalidDataError.status)
      .send({ message: invalidDataError.message });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(conflictError.status)
          .send({ message: conflictError.message });
      }

      return bcrypt
        .hash(req.body.password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((newUser) =>
          res.status(201).send({
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
          })
        );
    })
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

/* POST Login User */
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(invalidDataError.status)
      .send({ message: invalidDataError.message });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })

    .catch((err) => {
      console.error(err);
      if (err.message === "Incorret email or password") {
        return res
          .status(unauthorizedError.status)
          .send({ message: unauthorizedError.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

/* GET Current user by Id */
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundError.status)
          .send({ message: notFoundError.message });
      }
      if (err.name === "CastError") {
        return res
          .status(invalidDataError.status)
          .send({ message: invalidDataError.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

/* PATCH Update user profile */
const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(invalidDataError.status)
          .send({ message: invalidDataError.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundError.status)
          .send({ message: notFoundError.message });
      }
      if (err.name === "CastError") {
        return res
          .status(invalidDataError.status)
          .send({ message: invalidDataError.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
