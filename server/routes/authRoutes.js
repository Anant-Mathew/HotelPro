const express = require("express");
const router = express.Router();
const { signUp, login, getAllUsers } = require("../controllers/authController");

router.post("/SignUp", signUp);
router.post("/register", signUp);
router.post("/Login", login);
router.post("/login", login);
router.get("/allusers", getAllUsers);

module.exports = router;
