const {DBConnectionPool} = require("../database");

/**
 * Service to manage authentication-related inquiries.
 */
class AuthService {

    /**
     * Service to register a new account.
     * @param session The express session object passed to the service. Used to set the session username.
     * @param new_username The new username object to be
     * @returns {Promise<unknown>}
     */
    static register_account = function (session, new_username) {
        return new Promise(async (resolve, reject) => {
            let db_instance, db_connection, session;
            try {
                db_instance = await DBConnectionPool.getInstance();
                db_connection = db_instance.connection;
                session = db_connection.startSession();

                await session.startTransaction();

                if (await AuthService.#verify_account(new_username)) {
                    reject(`Error: The requested username '${new_username}' already exists!`);
                } else {
                    await db_connection.db("catalog").collection("account").insertOne({"username": new_username});
                    resolve("Account Registration Succeeded!");
                }
            } catch (exception) {
                reject(exception);
            }
        });
    }

    /**
     * Helper function to log the user out of the current session.
     * @param session The current session object.
     * @returns {Promise<unknown>} A Promise to log the user out of the current session out.
     */
    static logout_account = function (session) {
        return new Promise(async (resolve, reject) => {
            if (session.username === undefined) {
                reject("Error: You were not logged in to begin with!");
            } else {
                session.destroy();
                resolve("You've been successfully logged out!");
            }
        });
    }

    /**
     * Helper function to log the user into the specified username.
     * @param session The session object in question.
     * @param account_name The account name by which the user should be logged in.
     * @returns {Promise<unknown>} A Promise to log the user into the current session.
     */
    static login_account = function (session, account_name) {
        return new Promise(async (resolve, reject) => {
            if (await AuthService.#verify_account(account_name)) {
                session.username = account_name;
                resolve("Login Succeeded!");
            } else {
                reject(`Error: Account with username '${account_name}' does not exist!`);
            }
        });
    }

    /**
     * Private helper function to determine whether the given account username exists in the database.
     * @param account_name The username in question.
     * @returns {Promise<boolean>} An asynchronous function
     */
    static #verify_account = function (account_name) {
        return new Promise(async (resolve, reject) => {
            try {
                const db_instance = await DBConnectionPool.getInstance();
                const db_connection = db_instance.connection;
                const account = await db_connection.db("catalog").collection("account").findOne({"username": account_name});
                resolve(account !== null);
            } catch(exception) {
                reject(exception);
            }
        });
    }

    /**
     * Helper function to fetch the primary key that corresponds to the given username.
     * @param username The username in question.
     * @returns {Promise<String>} An asynchronous function that will return the primary key of the username (or throw an
     *                            Error if undefined).
     */
    static fetch_account_primary_key = function (username) {
        return new Promise(async (resolve, reject) => {
            try {
                const db_instance = await DBConnectionPool.getInstance();
                const db_connection = db_instance.connection;
                let results = [];
                let cursor = await db_connection.db("catalog").collection("account").find({"username": username});
                for await(const element of cursor) {
                    results.push(element);
                }
                if (results.length !== 1) {
                    reject(`Error: Unable to fetch primary key for account username '${username}'!`);
                } else {
                    resolve(String(results[0]._id));
                }
            } catch (exception) {
                reject(exception);
            }
        });
    }

}

module.exports = {AuthService};
