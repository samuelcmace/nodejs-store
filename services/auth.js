const {DBConnectionPool} = require("../database");

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
                    session.username = new_username;
                    resolve("Account Registration Succeeded!");
                }
            } catch (exception) {
                reject(exception);
            }
        });
    }

    /**
     *
     * @param session
     * @param account_name
     * @returns {Promise<unknown>}
     */
    static logout_account = function (session) {
        return new Promise(async (resolve, reject) => {
            if (session.username === undefined) {
                reject("Error: You were not logged in to begin with!");
            } else {
                session.username = undefined;
                resolve("You've been successfully logged out!");
            }
        });
    }

    /**
     *
     * @param session
     * @param account_name
     * @returns {Promise<unknown>}
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
    static #verify_account = async function (account_name) {
        const db_instance = await DBConnectionPool.getInstance();
        const db_connection = db_instance.connection;
        const account = await db_connection.db("catalog").collection("account").findOne({"username": account_name});
        return account !== undefined;
    }

    /**
     * Helper function to fetch the primary key that corresponds to the given username.
     * @param username The username in question.
     * @returns {Promise<*>} An asynchronous function that will return the primary key of the username (or throw an
     *                       Error if undefined).
     */
    static fetch_account_primary_key = async function (username) {
        const db_instance = await DBConnectionPool.getInstance();
        const db_connection = db_instance.connection;
        const account = await db_connection.db("catalog").collection("account").findOne({"username": username});
        if (account === undefined) throw new Error(`Error: Unable to fetch primary key for account username '${username}'!`); else return account._id;
    }

}

module.exports = {AuthService};
