const express = require("express");
const router = express.Router();

const scoreController = require("../controllers/scoreController");

// TODO: not sure if i even need a list of scores when we have a list of sessions
// Get a user's list of scores
router.get("/scores", scoreController.score_list_get);
// Add score(s)
router.post("/scores", scoreController.score_post);
// Get score
router.get("/scores/:id", scoreController.score_get);
// Update score
router.put("/scores/:id", scoreController.score_put);
// Delete score
router.delete("/scores/:id", scoreController.score_delete);

module.exports = router;
