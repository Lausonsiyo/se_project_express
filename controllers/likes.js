const ClothingItem = require("../models/clothingItem");
const {
  invalidDataError,
  notFoundError,
  defaultError,
} = require("../utils/errors");

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new error("Item id not found");
      throw error;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
    });
};

const disLikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new error("Item id not found");
      throw error;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { likeItem, disLikeItem };
