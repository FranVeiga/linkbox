const { MongoServerError } = require("mongodb");
const DBHelper = require("../DBHelper");

const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASS = process.env.MONGODB_PASS;
const MONGODB_URI = process.env.MONGODB_URI;

const Db = new DBHelper(MONGODB_USER, MONGODB_PASS, MONGODB_URI);

/**
 * Gets the links for a particular user
 *
 * @returns Sends back an array of JSON objects, or Error if user not found.
 */
async function getUserLinks(req, res, next) {
    user = await Db.getUserByUsername(req.params.username);
    if (user) {
        res.json(user.links);
    } else {
        res.status(404);
        res.json(JSON.parse('{ "error": "not found" }'));
    }
}

/**
 * Creates new links on the database. Must have an array of link documents in the
 * request body.
 *
 * @returns Success if created correctly, Error if not.
 */
async function createLink(req, res, next) {
    try {
        const user = await Db.getUserByUsername(req.params.username);
        let linkAmount = user.links.length;

        for (let i = 0; i < req.body.length; i++) {
            req.body[i].order = linkAmount;
            linkAmount++;
        }

        await Db.usersColl().updateOne(
            { username: req.params.username },
            { $push: { links: { $each: req.body } } }
        );
        res.json({ success: "links added" });
    } catch (e) {
        res.status(500);
        console.dir(e);
        res.json({ error: "error while appending links" });
    }
}

/**
 * Deletes a given link from the database. Does not throw error if the link
 * passed in does not exist
 *
 * @return Success if deleted correctly, Error if not.
 */
async function deleteLink(req, res, next) {
    try {
        linkPos = parseInt(req.params.linkPos);

        await Db.usersColl().updateOne(
            { username: req.params.username },
            {
                $pull: { links: { order: linkPos } },
            }
        );

        await Db.usersColl().updateOne(
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
}

/**
 * Updates a link information
 *
 * @returns Success if updated correctly, Error if not
 */
async function updateLink(req, res, next) {
    try {
        const linkPos = parseInt(req.params.linkPos);

        for (let prop in req.body) {
            // It has to be done this way because I haven't found a way to
            // dynamically update fields of an embedded document inside an array
            setPropQuery = `{"links.$.${prop}":"${req.body[prop]}"}`;
            setPropQuery = JSON.parse(setPropQuery);

            await Db.usersColl().updateOne(
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
}

module.exports = { getUserLinks, createLink, deleteLink, updateLink };
