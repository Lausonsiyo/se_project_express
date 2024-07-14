const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const { BadRequestError } = require("../utils/Errors/badRequestError");
const { NotFoundError } = require("../utils/Errors/notFoundError");
const { UnauthorizedError } = require("../utils/Errors/unauthorizedError");
const { ConflictError } = require("../utils/Errors/conflictError");

/* POST Create User */
const createUser = (req, res, next) => {
  const { name, avatar, email } = req.body;

  if (!email) {
    next(new BadRequestError("Email required."));
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError("User already exists."));
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
        return next(new BadRequestError("Invalid data."));
      }
      return next(err);
    });
};

/* POST Login User */
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(BadRequestError("Email and password are required."));
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
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password."));
      }
      return next(err);
    });
};

/* GET Current user by Id */
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found."));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(err);
    });
};

/* PATCH Update user profile */
const updateProfile = (req, res, next) => {
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
        return next(new BadRequestError("Invalid data."));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found."));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
