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
// const deleteItem = (req, res) => {
//   const { itemId } = req.params;
//   ClothingItem.findByIdAndDelete({ _id: itemId })
//     .orFail(() => {
//       const error = new Error("Item Id Not Found");
//       error.status = notFoundError.status;
//       throw error;
//     })
//     .then((item) => {
//       if (String(item.owner) !== owner)
//         return res
//           .status(forbiddenError.status)
//           .send({ message: forbiddenError.message });

//       return item.deleteOne().then(res.send({ message: "Item deleted" }));
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "Error") {
//         return res
//           .status(notFoundError.status)
//           .send({ message: notFoundError.message });
//       }
//       if (err.name === "CastError") {
//         return res
//           .status(invalidDataError.status)
//           .send({ message: invalidDataError.message });
//       }
//       return res
//         .status(defaultError.status)
//         .send({ message: defaultError.message });
//     });
// };
// const deleteItem = (req, res) => {
//   const { itemId, owner, _id } = req.params;
//   if (owner === _id) {
//     ClothingItem.findByIdAndDelete(itemId)
//       .orFail(() => {
//         const error = new Error("Item Id Not Found");
//         error.status = notFoundError.status;
//         throw error;
//       })
//       .then(res.send({ message: "Item Deleted." }))
//       .catch((err) => {
//         console.error(err);
//         if (err.name === "Error") {
//           return res
//             .status(notFoundError.status)
//             .send({ message: notFoundError.message });
//         }
//         if (err.name === "CastError") {
//           return res
//             .status(invalidDataError.status)
//             .send({ message: invalidDataError.message });
//         }
//         return res
//           .status(defaultError.status)
//           .send({ message: defaultError.message });
//       });
//   }
//   if (owner !== _id) {
//     res.status(forbiddenError.status).send({ message: forbiddenError.message });
//   }
// };
const deleteItem = (req, res) => {
  const { itemId, owner, _id } = req.params;
  if (owner === _id) {
    ClothingItem.findByIdAndDelete(itemId)
      .then((item) => {
        if (!item) {
          const error = new Error("Item Id Not Found");
          error.status = notFoundError.status;
          throw error;
        }
        return res.send({ message: "Item Deleted." });
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
  }
  if (owner !== _id) {
    res.status(forbiddenError.status).send({ message: forbiddenError.message });
  }
};

module.exports = { createItem, getItems, deleteItem };
