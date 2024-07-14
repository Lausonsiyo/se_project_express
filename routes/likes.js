const router = require("express").Router();

const { authorization } = require("../middlewares/auth");

const { likeItem, disLikeItem } = require("../controllers/likes");

const { validateId } = require("../middlewares/validation");

router.put("/:itemId/likes", validateId, authorization, likeItem);
router.delete("/:itemId/likes", validateId, authorization, disLikeItem);

module.exports = router;
