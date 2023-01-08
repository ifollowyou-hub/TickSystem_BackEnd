const express = require("express");
const router = express.Router();
const quotes = require("../services/ticketDB");

/* GET ticket by id */
router.get("/:tId", async function (req, res, next) {
  try {
    res.json(await quotes.getOne(req.params.tId));
  } catch (err) {
    console.error(`err=> `, err.message);
    next(err);
  }
});

/* GET tickets. */
router.post("/", async function (req, res, next) {
  try {
    res.json(await quotes.getMultiple(req.body));
  } catch (err) {
    console.error(`err=> `, err);
    next(err);
  }
});

/* insert new ticket. */
router.post("/insert", async function (req, res, next) {
  try {
    res.json(await quotes.insertOne(req.body));
  } catch (err) {
    console.error(`err=> `, err.message);
    next(err);
  }
});

/* update data of exist ticket. */
router.put("/updateOne", async function (req, res, next) {
  try {
    res.json(await quotes.updateById(req.body));
  } catch (err) {
    console.error(`err=> `, err.message);
    next(err);
  }
});

/* delete a ticket. */
router.delete("/:tId", async function (req, res, next) {
  try {
    res.json(await quotes.deleteById(req.params));
  } catch (err) {
    console.error(`err=> `, err.message);
    next(err);
  }
});

module.exports = router;
