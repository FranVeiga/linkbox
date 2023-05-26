const express = require("express");
const { MongoClient, MongoServerError } = require("mongodb");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const {
    getUserInfo,
    createUser,
    updateUser,
    deleteUser,
} = require("../controllers/username");

const {
    getUserLinks,
    createLink,
    updateLink,
    deleteLink,
} = require("../controllers/links");

/////////////////////////////////////////////////////
//  Handling api requests on the /username endpoint
/////////////////////////////////////////////////////

router.get("/:username", getUserInfo);

router.post("/:username", createUser);

router.delete("/:username", deleteUser);

router.put("/:username", updateUser);

//////////////////////////////////////////////////////
//  Handling requests on the /username/links endpoint
//////////////////////////////////////////////////////

router.get("/:username/links", getUserLinks);

router.post("/:username/links", createLink);

router.delete("/:username/links/:linkPos", deleteLink);

router.put("/:username/links/:linkPos", updateLink);

module.exports = router;
