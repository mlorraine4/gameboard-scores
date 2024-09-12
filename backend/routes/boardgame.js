const express = require("express");
const router = express.Router();

const boardgameController = require("../controllers/boardgameController");

// Get boardgame geek search results
router.get("/search", boardgameController.boardgame_search);
// Get boardgame geek results by id
router.get("/boardgames/:id", boardgameController.boardgame_by_id);
// Get user saved boardgames
router.get("/me/boardgames", boardgameController.user_boardgames_get);
// Update user saved boardgames
router.put("/me/boardgames", boardgameController.user_boardgames_put);

module.exports = router;
