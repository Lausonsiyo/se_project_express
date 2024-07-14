const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateUserInfo } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUserInfo, updateProfile);

module.exports = router;
