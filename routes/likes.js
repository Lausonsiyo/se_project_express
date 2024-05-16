const router = require("express").Router();
const { likeItem, disLikeItem } = require("../controllers/likes");

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", disLikeItem);

module.exports = router;
