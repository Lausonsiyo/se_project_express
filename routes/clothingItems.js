const router = require("express").Router();
const { authorization } = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

router.post("/", authorization, createItem);
router.get("/", getItems);
router.delete("/:itemId", authorization, deleteItem);

module.exports = router;
