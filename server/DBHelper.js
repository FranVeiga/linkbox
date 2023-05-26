const { MongoClient } = require("mongodb");

class DBHelper {
    constructor(MONGODB_USER, MONGODB_PASS, MONGODB_URI) {
        this._MONGODB_USER = MONGODB_USER;
        this._MONGODB_PASS = MONGODB_PASS;
        this._MONGODB_URI = MONGODB_URI;
        this._connectionUri = `mongodb+srv://${this._MONGODB_USER}:${this._MONGODB_PASS}@${this._MONGODB_URI}/?retryWrites=true&w=majority`;
        this.client = new MongoClient(this._connectionUri);

        this.client.connect({
            server: {
                auto_reconnect: true,
            },
        });
    }

    /**
     * @returns The database collection containing all the users
     */
    usersColl() {
        return this.client.db("accounts").collection("users");
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
    async getUserByUsername(username) {
        const user = await this.usersColl().findOne({ username: username });
        return user;
    }
}

module.exports = DBHelper;
