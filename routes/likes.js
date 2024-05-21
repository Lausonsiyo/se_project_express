const router = require("express").Router();

const { authorization } = require("../middlewares/auth");

const { likeItem, disLikeItem } = require("../controllers/likes");

router.put("/:itemId/likes", authorization, likeItem);
router.delete("/:itemId/likes", authorization, disLikeItem);

module.exports = router;
