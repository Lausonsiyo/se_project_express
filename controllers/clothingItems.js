const ClothingItem = require("../models/clothingItem");
const {
  invalidDataError,
  notFoundError,
  defaultError,
} = require("../utils/errors");

/* POST create new item */
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
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
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

/* PUT update item */
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
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
  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Item Id Not Found");
      error.status = notFoundError.status;
      throw error;
    })
    .then((item) => res.status(204).send({}))
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
