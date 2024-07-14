const router = require("express").Router();
const { authorization } = require("../middlewares/auth");
const {
  validateId,
  validateClothingItem,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

router.post("/", authorization, validateClothingItem, createItem);
router.get("/", getItems);
router.delete("/:itemId", validateId, authorization, deleteItem);

module.exports = router;
