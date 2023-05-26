const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASS = process.env.MONGODB_PASS;
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@linkbox.mnmvy6k.mongodb.net/?retryWrites=true&w=majority`;

const dbClient = new MongoClient(uri);
dbClient.connect({
    server: {
        auto_reconnect: true,
    },
});

router.get("/", async function(req, res, next) {
    const person = await dbClient.db("accounts").collection("users").findOne();
    res.json(person);
});

module.exports = router;
