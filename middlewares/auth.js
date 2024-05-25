const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const { unauthorizedError } = require("../utils/errors");

module.exports.authorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(unauthorizedError.status)
      .send({ message: unauthorizedError.message });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res
      .status(unauthorizedError.status)
      .send({ message: unauthorizedError.message });
  }
  req.user = payload;
  return next();
};
