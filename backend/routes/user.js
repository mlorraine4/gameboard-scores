const express = require("express");
const router = express.Router();

// Controllers
const userController = require("../controllers/userController");

// Get all friends of current user
router.get("/me/friends", userController.friend_list);
// Add friend to current user
router.put("/me/friends/:username", userController.friend_put);
// Remove friend from current user
router.delete("/me/friends/:username", userController.friend_delete);
// Get all friend requests for current user
router.get("/me/friend-requests", userController.friend_request_list);
// Get user search result ex: /users/search?username=username
router.get("/users/search", userController.user_search);
// Get profile info
router.get("/me/profile");
// Update user profile info
router.put("/me/profile", userController.user_profile_put);
// Update user account info
// TODO: implement request
// router.put("/me/account", userController.user_account_update);

module.exports = router;
