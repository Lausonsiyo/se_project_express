const router = require("express").Router();

const { createUser, login } = require("../controllers/users");
const { authorization } = require("../middlewares/auth");
const {
  validateUserInfo,
  validateLogin,
} = require("../middlewares/validation");

const { NotFoundError } = require("../utils/Errors/notFoundError");

const clothingItemsRouter = require("./clothingItems");
const likeItemRouter = require("./likes");
const userRouter = require("./users");

router.use("/users", authorization, userRouter);
router.use("/items", clothingItemsRouter);
router.use("/items", likeItemRouter);

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserInfo, createUser);

router.use((req, res, next) => next(new NotFoundError("Router not found")));

module.exports = router;
