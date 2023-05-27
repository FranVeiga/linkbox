var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

var apiRouter = require("./routes/api");

dotenv.config();

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Test initial connection to MongoDB database
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASS = process.env.MONGODB_PASS;
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@linkbox.mnmvy6k.mongodb.net/?retryWrites=true&w=majority`;
async function dbConnectionTest() {
    const dbClient = new MongoClient(uri);
    await dbClient.connect(uri);
    await dbClient.close();
}
dbConnectionTest()
    .then(() => console.log("Successful connection to database."))
    .catch((e) => {
        console.dir(e);
        process.exit(1);
    });

app.use("/api/v1", apiRouter);

module.exports = app;
