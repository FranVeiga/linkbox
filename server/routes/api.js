const express = require("express");
const { MongoClient, MongoServerError } = require("mongodb");
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

/**
 * @returns The database collection containing all the users
 */
function usersColl() {
    return dbClient.db("accounts").collection("users");
}

/**
 * Queries the db for an account with the username 'username'
 *
 * @param {string} username - The username of the account queried
 * @returns A JSON object with the user info or null if not found
 *
 * @example
 *       getUserByUsername("johnsmith")
 *
 */
async function getUserByUsername(username) {
    const user = await usersColl().findOne({ username: username });
    return user;
}

/////////////////////////////////////////////////////
//  Handling api requests on the /:username endpoint
/////////////////////////////////////////////////////

/**
 * Handles GET requests for a specified username endpoint.
 * @returns Sends back a json containing user info.
 */
router.get("/:username", async function (req, res, next) {
    user = await getUserByUsername(req.params.username);
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        res.json(JSON.parse('{ "error": "not found" }'));
    }
});

/**
 * Creates a new user on the database.
 * Note that the username in the endpoint must match with the username passed in
 * the body of the request.
 *
 * @returns Success if the user was created correctly, Error if not
 */
router.post("/:username", async function (req, res, next) {
    const userInDb = await getUserByUsername(req.params.username);

    if (userInDb != null) {
        res.status(500);
        res.json({ error: "user already exists" });
    } else if (req.params.username != req.body.username) {
        res.status(500);
        res.json({
            error: "url username and request body username does not match",
        });
    } else {
        const newUser = {
            username: req.body.username,
            password: req.body.password,
            links: [],
        };

        try {
            await usersColl().insertOne(newUser);
            res.json(newUser);
            next();
        } catch (e) {
            res.status(500);
            if (e instanceof MongoServerError) {
                res.json({ "Server Error": e.message });
            } else {
                res.json({ error: e.message });
            }
        }
    }
});

/**
 * Deletes a user from the database
 *
 * @returns Success if deleted correctly, error if not.
 */
router.delete("/:username", async function (req, res, next) {
    const user = await getUserByUsername(req.params.username);
    try {
        await usersColl().deleteOne({ _id: user._id });
        res.json({ success: "user removed" });
    } catch (e) {
        res.status(500);
        res.json({ error: e.message });
    }
});

/**
 * Updates a user in the database. Only the fields passed in the body of the
 * request will be updated.
 *
 * @returns Success if updated correctly, Error if not
 */
router.put("/:username", async function (req, res, next) {
    try {
        await usersColl().updateOne({ username: req.params.username }, [
            { $set: req.body },
        ]);
        res.json({ success: "user updated" });
    } catch (e) {
        res.status(500);
        res.json({ error: e.message });
    }
});

////////////////////////////////////////////
//  Handling requests on the links endpoint
////////////////////////////////////////////

/**
 * Gets the links for a particular user
 *
 * @returns Sends back an array of JSON objects, or Error if user not found.
 */
router.get("/:username/links", async function (req, res, next) {
    user = await getUserByUsername(req.params.username);
    if (user) {
        res.json(user.links);
    } else {
        res.status(404);
        res.json(JSON.parse('{ "error": "not found" }'));
    }
});

/**
 * Creates new links on the database. Must have an array of link documents in the
 * request body.
 *
 * @returns Success if created correctly, Error if not.
 */
router.post("/:username/links", async function (req, res, next) {
    try {
        const user = await getUserByUsername(req.params.username);
        let linkAmount = user.links.length;

        for (let i = 0; i < req.body.length; i++) {
            req.body[i].order = linkAmount;
            linkAmount++;
        }

        await usersColl().updateOne(
            { username: req.params.username },
            { $push: { links: { $each: req.body } } }
        );
        res.json({ success: "links added" });
    } catch (e) {
        res.status(500);
        console.dir(e);
        res.json({ error: "error while appending links" });
    }
});

/**
 * Deletes a given link from the database. Does not throw error if the link
 * passed in does not exist
 *
 * @return Success if deleted correctly, Error if not.
 */
router.delete("/:username/links/:linkPos", async function (req, res, next) {
    try {
        linkPos = parseInt(req.params.linkPos);

        await usersColl().updateOne(
            { username: req.params.username },
            {
                $pull: { links: { order: linkPos } },
            }
        );

        await usersColl().updateOne(
            { username: req.params.username },
            { $inc: { "links.$[element].order": -1 } },
            { arrayFilters: [{ "element.order": { $gt: linkPos } }] }
        );

        res.json({ success: "deleted link" });
    } catch (e) {
        res.status(500);
        console.dir(e);
        res.json({ error: "error deleting link" });
    }
});

/**
 * Updates a link information
 *
 * @returns Success if updated correctly, Error if not
 */
router.put("/:username/links/:linkPos", async function (req, res, next) {
    try {
        const linkPos = parseInt(req.params.linkPos);

        for (let prop in req.body) {
            // It has to be done this way because I haven't found a way to
            // dynamically update fields of an embedded document inside an array
            setPropQuery = `{"links.$.${prop}":"${req.body[prop]}"}`;
            setPropQuery = JSON.parse(setPropQuery);

            await usersColl().updateOne(
                { username: req.params.username, "links.order": linkPos },
                { $set: setPropQuery }
            );
        }

        res.json({ success: "updated link" });
    } catch (e) {
        res.status(500);
        console.dir(e);
        res.json({ error: "error updating link" });
    }
});

module.exports = router;
