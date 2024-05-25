const ClothingItem = require("../models/clothingItem");
const {
  invalidDataError,
  notFoundError,
  defaultError,
  forbiddenError,
} = require("../utils/errors");

/* POST create new item */
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
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

/* GET all items */
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

/* DELETE item */
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(forbiddenError.status)
          .send({ message: forbiddenError.message });
      }

      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted." }));
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

module.exports = { createItem, getItems, deleteItem };
