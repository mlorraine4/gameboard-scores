const express = require("express");
const router = express.Router();

const gameboardController = require("../controllers/gameboardController");

// Get boardgame geek search results
router.get("/search", gameboardController.boardgame_search);
router.get("/boardgame/:id", gameboardController.gameboard_by_id);

module.exports = router;
