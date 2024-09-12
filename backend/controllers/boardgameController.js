const asyncHandler = require("express-async-handler");
const { query, param, validationResult } = require("express-validator");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Boardgame = require("../models/boardgame");

exports.boardgame_search = [
  query("search").notEmpty().escape(),
  asyncHandler(async (req, res) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded.user_id).exec();

        if (user === null) {
          // Unauthorized user
          return res.sendStatus(401);
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          // Search param is not valid. Send errors.
          res.status(400).send(errors.array());
        }

        // Get queried data from BoardGameGeek's API
        const search = req.query.search;
        console.log("searching boardgames");
        const example_search = "Crossbows%20and%20Catapults";
        let boardgameResults = [];

        const response = await fetch(
          "https://boardgamegeek.com/xmlapi/search?search=" + search
        );
        // xml data string
        const data = await response.text();
        // Parse xml string
        const xmlDom = new JSDOM(data, { contentType: "text/xml" });
        const { document } = xmlDom.window;

        // HTML collection of boardgame tags
        let collection = document.getElementsByTagName("boardgame");

        // Check for errors
        let errorTag = collection[0].getElementsByTagName("error");
        if (errorTag.length > 0) {
          return res.status(500).send({
            error: errorTag.innerHTML,
          });
        }

        // For each result, create object with gameboard id and title
        [...collection].forEach((tag) => {
          let boardgame = {};
          let elements = tag.getElementsByTagName("name");
          let title;
          for (let el of elements) {
            if (el.hasAttribute("primary")) {
              title = el.innerHTML;
            }
          }

          boardgame.bgg_id = tag.getAttribute("objectid");
          boardgame.title = title;

          boardgameResults.push(boardgame);
        });

        console.log(boardgameResults);
        return res.status(200).send({ boardgames: boardgameResults });
      }
      // Unauthorized user
      return res.sendStatus(401);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }),
];

exports.boardgame_by_id = [
  param("id").notEmpty().escape(),
  asyncHandler(async (req, res) => {
    try {
      console.log(req.params.id);
      if (req.headers.authorization) {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded.user_id).exec();

        if (user === null) {
          // Unauthorized user
          return res.sendStatus(401);
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // Id param is not valid. Send errors.
          res.status(400).send(errors.array());
        }

        // Get queried data from BoardGameGeek's API
        const response = await fetch(
          "https://boardgamegeek.com/xmlapi/boardgame/" + req.params.id
        );
        // xml data string
        const data = await response.text();
        // Parse xml string
        const xmlDom = new JSDOM(data, { contentType: "text/xml" });
        const { document } = xmlDom.window;

        let collection = document.getElementsByTagName("boardgame");
        let boardgame = {};

        // Check for errors
        let error_tag = collection[0].getElementsByTagName("error");
        if (error_tag.length > 0) {
          return res.status(500).send({
            error: error_tag.innerHTML,
          });
        }

        let elements = collection[0].getElementsByTagName("name");
        let title;
        for (let el of elements) {
          if (el.hasAttribute("primary")) {
            title = el.innerHTML;
          }
        }

        boardgame.title = title;
        boardgame.bgg_id = collection[0].getAttribute("objectid");
        boardgame.photo_url =
          collection[0].getElementsByTagName("image")[0].innerHTML || "";
        boardgame.description =
          collection[0].getElementsByTagName("description")[0].innerHTML || "";

        return res.status(200).send({ boardgame: boardgame });
      }
      // Unauthorized user
      return res.sendStatus(401);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }),
];

exports.user_boardgames_get = asyncHandler(async (req, res) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.user_id, "boardgames")
        .populate("boardgames")
        .exec();

      if (user === null) {
        // Unauthorized user
        return res.sendStatus(401);
      }

      return res.status(200).send({ boardgames: user.boardgames });
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

exports.user_boardgames_put = asyncHandler(async (req, res) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.user_id).exec();

      if (user === null) {
        // Unauthorized user
        return res.sendStatus(401);
      }

      // Check if user already has boardgame saved
      const hasBoardgame = (boardgame) => boardgame.bgg_id === req.body.id;
      if (user.boardgames.some(hasBoardgame)) {
        // User already has boardgame saved, send error
        return res.sendStatus(409);
      }

      const dbBoardgame = await Boardgame.findOne({
        bgg_id: req.body.id,
      }).exec();

      if (dbBoardgame) {
        // Boardgame data exists in db
        // Save to user boardgames array
        user.boardgames.push(dbBoardgame);
        await user.save();
        return res.sendStatus(200);
      } else {
        // Save data to db
        // Get data from BoardGameGeek's API
        const response = await fetch(
          "https://boardgamegeek.com/xmlapi/boardgame/" + req.body.id
        );
        // xml data string
        const data = await response.text();
        // Parse xml string
        const xmlDom = new JSDOM(data, { contentType: "text/xml" });
        const { document } = xmlDom.window;

        let collection = document.getElementsByTagName("boardgame");

        // Check for errors
        let error_tag = collection[0].getElementsByTagName("error");
        if (error_tag.length > 0) {
          return res.status(500).send({
            error: error_tag.innerHTML,
          });
        }

        let elements = collection[0].getElementsByTagName("name");
        let title;
        for (let el of elements) {
          if (el.hasAttribute("primary")) {
            title = el.innerHTML;
          }
        }
        let photo_url =
          collection[0].getElementsByTagName("image")[0].innerHTML;
        let description =
          collection[0].getElementsByTagName("description")[0].innerHTML;

        const boardgame = new Boardgame({
          bgg_id: req.body.id,
          title: title,
          photo_url: photo_url,
          description: description,
        });

        console.log(boardgame);

        const result = await boardgame.save();
        // Save data to user boardgames array
        user.boardgames.push(result);
        await user.save();
        return res.sendStatus(200);
      }
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});
exports.user_boardgames_delete;
