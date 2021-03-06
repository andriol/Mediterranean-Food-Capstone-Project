const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const auth = require("../middleware/auth");
const validation = require("../middleware/users");

router.post("/register", validation.validateUser, (req, res) => {
  const { password } = req.body;
  bcrypt.hash(
    password,

    SALT_ROUNDS,
    (err, hashedPassword) => {
      if (err)
        return res.status(500).json({ message: "couldn't encrypt password" });

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      newUser
        .save()
        .then((newUser) => {
          const token = auth.signJWTToken(newUser);
          res.status(201).json({ authToken: token, id: newUser.attributes.id });
        })

        .catch((err) => {
          res.status(400).json({ message: "Error, can't register new user" });
        });
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.where({ email })
    .fetch()
    .then((user) => {
      console.log(user);
      bcrypt.compare(
        password,
        user.attributes.password,
        function (err, success) {
          console.log(password, user.attributes.password);
          if (success) {
            const token = auth.signJWTToken(user);
            return res
              .status(200)
              .json({ authToken: token, id: user.attributes.id });
          } else {
            return res
              .status(403)
              .json({ message: "Username/password combination is wrong" });
          }
        }
      );
    })
    .catch(() => {
      return res.status(400).json({ message: "User is not found" });
    });
});

router.get("/profile", auth.auth, (req, res) => {
  User.where({ id: req.decoded.id })
    .fetch({ withRelated: ["recipes"] })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({ message: "can't fetch user profile" });
    });
});

module.exports = router;
