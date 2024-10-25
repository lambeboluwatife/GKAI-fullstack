const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser } = require("../controllers/users");
const { generateToken } = require("../middlewares/jwt");

const { upload } = require("../config/multerConfig");

router.route("/login").post(loginUser, generateToken);
router.route("/register").post(upload.single("profilePicture"), registerUser);
router.route("/logout").get(logoutUser);

module.exports = router;

// MONGO_URI=mongodb://localhost:27017/gkai
