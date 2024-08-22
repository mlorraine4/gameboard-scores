const express = require("express");
const router = express.Router();

// Controllers
const userController = require("../controllers/userController");

// Router
router.post("/sign-up", userController.sign_up_post);
router.post("/login", userController.login_post);

module.exports = router;
