const express = require("express");
const router = express.Router();
const quotes = require("../services/ticketDB");

/*  */
router.post("/getTickets", async function (req, res, next) {
  try {
    res.json(await quotes.s_getTickets(req.body));
  } catch (err) {
    console.error(`err=> `, err);
    next(err);
  }
});

/*  */
router.post("/all_resolve_open", async function (req, res, next) {
  try {
    res.json(await quotes.s_all_resolve_open(req.body));
  } catch (err) {
    console.error(`err=> `, err);
    next(err);
  }
});

/*  */
router.post("/open_daily", async function (req, res, next) {
  try {
    res.json(await quotes.s_open_daily(req.body));
  } catch (err) {
    console.error(`err=> `, err);
    next(err);
  }
});

/*  */
router.post("/urgent_medium_easy", async function (req, res, next) {
  try {
    res.json(await quotes.s_urgent_medium_easy(req.body));
  } catch (err) {
    console.error(`err=> `, err);
    next(err);
  }
});

module.exports = router;
