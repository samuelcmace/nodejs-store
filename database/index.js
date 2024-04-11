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
        this.mongo_connection_string = process.env.MONGO_CONNECTION_STRING;
        if (this.mongo_connection_string === undefined) {
            this.mongo_connection_string = "mongodb://localhost:27017/?directConnection=true";
        }
        this.connection = new MongoClient(this.mongo_connection_string);

        /**
         * Environment variable representing the MongoDB Connection Timeout.
         * @type {number} An Integer representing the number of milleseconds the
         */
        this.mongo_connection_timeout = parseInt(process.env.MONGO_CONNECTION_TIMEOUT);
        if (this.mongo_connection_timeout === undefined) {
            this.mongo_connection_timeout = 3000;
        }

        /**
         * Environment variable representing the number of retries the client should attempt to connect to the server
         * before rejecting the connection request.
         * @type {number}
         */
        this.mongo_connection_retries = parseInt(process.env.MONGO_CONNECTION_RETRIES);
        if (this.mongo_connection_retries === undefined) {
            this.mongo_connection_retries = 3000;
        }

    }

    /**
     * Function to determine whether the database connection is up and running.
     * @returns {boolean} A boolean determining whether the connection to the MongoDB instance is active and healthy.
     */
    is_connected = function () {
        return !!this.connection && !!this.connection.topology && this.connection.isConnected();
    }

    /**
     * Promise-based function to establish a connection to the database.
     * @returns {Promise<unknown>} A Promise representing the outcome of the connection request.
     */
    connect = function () {
        return new Promise(async (resolve, reject) => {

            console.log(`Connecting to MongoDB at ${this.mongo_connection_string}`);

            // Attempt to connect to the database based on the maximum number of retries specified...
            for (let retry_iteration = 0; retry_iteration < this.mongo_connection_retries; retry_iteration++) {
                await this.connection.connect({serverSelectionTimeoutMS: this.mongo_connection_timeout});

                // If the connection succeeded, break the loop...
                if (this.is_connected()) {
                    break;
                }
            }

            if (this.is_connected()) {
                resolve("Server Connection Succeeded!");
            } else {
                reject("Server Connection Failed!");
            }
        });
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
        }

        // If the database connection has not yet been established (or is unhealthy for some reason), reconnect to the
        // database and then return the instance. Otherwise, just return the instance.
        if(!DBConnectionPool.instance.is_connected()) {
            await DBConnectionPool.instance.connect().then(() => {
                return DBConnectionPool.instance;
            });
        } else {
            return DBConnectionPool.instance;
        }

    }

}

module.exports = {DBConnectionPool};
