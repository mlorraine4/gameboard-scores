// Login, signup, logout, update account info
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.sign_up_post = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (user) {
      return res.status(409).send({ msg: "User already exists." });
    }

    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      password: encryptedPassword,
      photo_url: "",
      status: "",
      friends: [],
      favorite_boardgames: [],
      notifications: [],
    });

    // Save new user to db
    const result = await newUser.save();
    console.log(result);
    return res.status(201);
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

exports.login_post = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    // User found
    if (user) {
      const isAuth = await bcrypt.compare(req.body.password, user.password);
      // User exists, password is correct. Create and pass JSON Web Token
      if (isAuth) {
        const token = jwt.sign(
          { username: user.username, userID: user._id },
          process.env.SECRET,
          { expiresIn: "14d" }
        );
        return res.status(200).send({
          token: token,
        });
      } else {
        return res
          .status(401)
          .send({ msg: "Username or Password is not correct." });
      }
      // User does not exist
    } else {
      return res.status(401).send({ msg: "User not found." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});
