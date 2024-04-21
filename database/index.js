const process = require("process");

const {MongoClient} = require("mongodb");

/**
 * Class encapsulating a connection to the MongoDB Database.
 */
class DatabaseConnection {

    /**
     * Initializes a new instance of DatabaseConnection.
     */
    constructor() {

        /**
         * Environment variable representing the MongoDB Connection String. If left undefined, the server will establish
         * a direct connection to localhost.
         * @type {string} A String representing the connection URL.
         */
        if (process.env.MONGO_CONNECTION_STRING === undefined) {
            this.mongo_connection_string = "mongodb://localhost:27017/?directConnection=true";
        } else {
            this.mongo_connection_string = process.env.MONGO_CONNECTION_STRING;
        }
        this.connection = new MongoClient(this.mongo_connection_string);

        /**
         * Environment variable representing the MongoDB Connection Timeout.
         * @type {number} An Integer representing the number of milliseconds the MongoDB client should attempt to
         *                connect before timing out.
         */
        if (process.env.MONGO_CONNECTION_TIMEOUT === undefined) {
            this.mongo_connection_timeout = 15000;
        } else {
            this.mongo_connection_timeout = parseInt(process.env.MONGO_CONNECTION_TIMEOUT);
        }

    }

    /**
     * Promise-based function to establish a connection to the database.
     * @returns {Promise<unknown>} A Promise representing the outcome of the connection request.
     */
    connect = async function () {
        console.log(`Connecting to MongoDB at ${this.mongo_connection_string}`);
        await this.connection.connect({serverSelectionTimeoutMS: this.mongo_connection_timeout});
    }

}

/**
 * Singleton database connection pool instance.
 */
class DBConnectionPool {

    /**
     * Instantiates a new instance of DBConnectionPool
     */
    constructor() {
        throw new Error("Error: This is a Singleton object! Use DatabaseConnection.getInstance() instead.");
    }

    /**
     * Fetches the singleton instance of DatabaseConnection.
     * @returns {Promise<DatabaseConnection>} A Promise that returns the database connection when it is up and ready.
     */
    static getInstance = async function () {
        // If the singleton instance has not yet been instantiated, instantiate it.
        if (!DBConnectionPool.instance) {
            DBConnectionPool.instance = new DatabaseConnection();
            await DBConnectionPool.instance.connect();
        }
        return DBConnectionPool.instance;
    }

}

module.exports = {DBConnectionPool};
