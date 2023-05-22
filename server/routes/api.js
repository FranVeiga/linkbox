var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.send("Hola que tal");
  next();
});

module.exports = router;
