const express = require("express");
const router = express.Router();

// Controllers
const userController = require("../controllers/userController");

// Sign up post
router.post("/sign-up", userController.sign_up);
// Login post
router.post("/login", userController.login);

module.exports = router;
