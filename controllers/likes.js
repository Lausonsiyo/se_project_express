const ClothingItem = require("../models/clothingItem");

const { BadRequestError } = require("../utils/Errors/badRequestError");
const { NotFoundError } = require("../utils/Errors/notFoundError");

/* PUT Like item */
const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item id not found");
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data."));
      }
      if (err.name === "Error") {
        return next(new NotFoundError("User not found."));
      }
      return next(err);
    });
};

/* DELETE Dislike item */
const disLikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item id not found");
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data."));
      }
      if (err.name === "Error") {
        return next(new NotFoundError("User not found."));
      }
      return next(err);
    });
};

module.exports = { likeItem, disLikeItem };
