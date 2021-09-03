const express = require("express");
const router = express.Router();
const axios = require("axios");

// router.get("/", (req, res) => {
//   res.render("index");
// });

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/chat", (req, res) => {
  res.render("chat");
});
router.get("/auth", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`
  );
});
router.get("/oauth-callback", ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
    code,
  };

  const opts = {
    headers: {
      accept: "application/json",
    },
  };
  axios
    .post("https://github.com/login/oauth/access_token", body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      console.log("Token :", token);
      res.redirect(`/?token=${token}`);
    })
    .catch((err) => {
      res.status(500).json({
        err: err.message,
      });
    });
});

module.exports = router;
