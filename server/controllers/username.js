const { MongoServerError } = require("mongodb");
const DBHelper = require("../DBHelper");

const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASS = process.env.MONGODB_PASS;
const MONGODB_URI = process.env.MONGODB_URI;
const Db = new DBHelper(MONGODB_USER, MONGODB_PASS, MONGODB_URI);

/**
 * Handles GET requests for a specified username endpoint.
 * @returns Sends back a json containing user info.
 */
async function getUserInfo(req, res, next) {
    user = await Db.getUserByUsername(req.params.username);
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        res.json(JSON.parse('{ "error": "not found" }'));
    }
}

/**
 * Creates a new user on the database.
 * Note that the username in the endpoint must match with the username passed in
 * the body of the request.
 *
 * @returns Success if the user was created correctly, Error if not
 */
async function createUser(req, res, next) {
    const userInDb = await Db.getUserByUsername(req.params.username);

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
            await Db.usersColl().insertOne(newUser);
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
}

/**
 * Deletes a user from the database
 *
 * @returns Success if deleted correctly, error if not.
 */
async function deleteUser(req, res, next) {
    const user = await Db.getUserByUsername(req.params.username);
    try {
        await Db.usersColl().deleteOne({ _id: user._id });
        res.json({ success: "user removed" });
    } catch (e) {
        res.status(500);
        res.json({ error: e.message });
    }
}

/**
 * Updates a user in the database. Only the fields passed in the body of the
 * request will be updated.
 *
 * @returns Success if updated correctly, Error if not
 */
async function updateUser(req, res, next) {
    try {
        await Db.usersColl().updateOne({ username: req.params.username }, [
            { $set: req.body },
        ]);
        res.json({ success: "user updated" });
    } catch (e) {
        res.status(500);
        res.json({ error: e.message });
    }
}

module.exports = { createUser, getUserInfo, deleteUser, updateUser };
