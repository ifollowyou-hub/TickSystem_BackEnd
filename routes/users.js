var express = require("express");
var router = express.Router();
const quotes = require("../services/usersDB");

/* GET users listing. */
router.get("/all", async function (req, res, next) {
  try {
    res.json(await quotes.getMultiple(req.query.page));
  } catch (err) {
    next(err);
  }
});

/* GET user info by userId. */
router.get("/:id", async function (req, res, next) {
  res.send("respond with a resource");
});

/* SIGNIN user. */
router.post("/signin", async function (req, res, next) {
  try {
    res.json(await quotes.signin(req.body));
  } catch (err) {
    next(err);
  }
});

/* CREATE user. */
router.post("/register", async function (req, res, next) {
  try {
    res.json(await quotes.resigter(req.body));
  } catch (err) {
    next(err);
  }
});

/* UPDATE user info. */
router.put("/updateInfo", async function (req, res, next) {
  try {
    res.json(await quotes.updateInfo(req.body));
  } catch (err) {
    next(err);
  }
});

// not yet
/* UPDATE user avatar. */
router.put("/updateAvatar", async function (req, res, next) {
  res.send("respond with a resource");
});

/* DELETE user. */
router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await quotes.deleteById(req.params));
  } catch (err) {
    console.error(`err=> `, err.message);
    next(err);
  }
});

module.exports = router;
