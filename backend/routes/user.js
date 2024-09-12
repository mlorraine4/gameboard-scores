const express = require("express");
const router = express.Router();

// Controllers
const userController = require("../controllers/userController");

// Get current user data
router.get("/me", userController.user_get);
// TODO: IMPLEMENT user put
// Update current user data
// router.put("/me", userController.user_put);
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

module.exports = router;
