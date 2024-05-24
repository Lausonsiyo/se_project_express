const jwt = require("jsonwebtoken");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const {
  invalidDataError,
  notFoundError,
  defaultError,
  unauthorizedError,
  conflictError,
} = require("../utils/errors");

/* GET all users */
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

/* POST Create User */
const createUser = (req, res) => {
  const { name, avatar, email } = req.body;
  if (!email) {
    return res
      .status(invalidDataError.status)
      .send({ message: invalidDataError.message });
  }
  User.findOne({ email }).then((user) => {
    if (user)
      return res
        .status(conflictError.status)
        .send({ message: conflictError.message });
  });
  return bcrypt.hash(req.body.password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .then((user) =>
        res
          .status(201)
          .send({ name: user.name, email: user.email, avatar: user.avatar })
      )
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
      })
  );
};
// const createUser = (req, res) => {
//   const { name, avatar, email } = req.body;

//   if (!email) {
//     return res
//       .status(invalidDataError.status)
//       .send({ message: invalidDataError.message });
//   }
//   User.findOne({ email }).then((user) => {
//     if (user) {
//       return res
//         .status(conflictError.status)
//         .send({ message: conflictError.message });
//     }
//   });
//   bcrypt.hash(req.body.password, 10).then((hash) =>
//     User.create({ name, avatar, email, password: hash })
//       .then((user) =>
//         res
//           .status(201)
//           .send({ name: user.name, email: user.email, avatar: user.avatar })
//       )
//       .catch((err) => {
//         console.error(err);
//         if (err.name === "ValidationError") {
//           return res
//             .status(invalidDataError.status)
//             .send({ message: invalidDataError.message });
//         }
//         return res
//           .status(defaultError.status)
//           .send({ message: defaultError.message });
//       })
//   );
// };

/* GET user by id */
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User Id Not Found");
      error.status = notFoundError.status;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "Error") {
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
      res
        .status(unauthorizedError.status)
        .send({ message: unauthorizedError.message });
    });
};

/* GET Current user by Id */
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((id) => {
      if (!id) {
        return res
          .status(notFoundError)
          .send({ message: notFoundError.message });
      }
      return res.status(200).send({ id });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "Error") {
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
      if (err.name === "Error") {
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
  getUsers,
  createUser,
  getUser,
  login,
  getCurrentUser,
  updateProfile,
};
