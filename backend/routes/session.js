const express = require("express");
const router = express.Router();

// Controllers
const sessionController = require("../controllers/sessionController");

// Get list of user game sessions (includes score data)
router.get("/me/sessions", sessionController.session_list_get);
// Add session
router.post("/me/sessions", sessionController.session_post);
// Get session (includes score data)
router.get("/sessions/:id", sessionController.session_get);
// Update session
router.put("/sessions/:id", sessionController.session_put);
// Delete session
router.delete("/sessions/:id", sessionController.session_delete);

module.exports = router;
