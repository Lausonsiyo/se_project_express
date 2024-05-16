const router = require("express").Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const likeItemRouter = require("./likes");

const { notFoundError } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);
router.use("/items", likeItemRouter);

router.use((req, res) =>
  res
    .status(notFoundError.status)
    .send({ message: "Requested resource not found" })
);

module.exports = router;
