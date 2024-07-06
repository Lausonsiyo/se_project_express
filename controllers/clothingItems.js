const ClothingItem = require("../models/clothingItem");

const { BadRequestError } = require("../utils/Errors/badRequestError");
const { NotFoundError } = require("../utils/Errors/notFoundError");
const { ForbiddenError } = require("../utils/Errors/forbiddenError");

/* POST create new item */
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(err);
    });
};

/* GET all items */
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

/* DELETE item */
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return next(new ForbiddenError("This item doesn't belong to you."));
      }

      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted." }));
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

module.exports = { createItem, getItems, deleteItem };
