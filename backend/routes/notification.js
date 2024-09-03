const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");

// Get all notifications for current user
router.get("/me/notifications", notificationController.notification_list);
// Update notification of user
router.put("/me/notifications/:id", notificationController.notification_update);
// Delete notification of user
router.delete(
  "/me/notifcations/:id",
  notificationController.notification_delete
);
