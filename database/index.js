const process = require("process");

const {MongoClient} = require("mongodb");

// Create a class to represent a connection to the MongoDB database.
class DatabaseConnection {
    constructor() {
        // If the application is being hosted inside Docker, the process.env.MONGO_CONNECTION_STRING will populate for
        // us the connection string used to connect to the database. On the other hand, if we are running the web server
        // directly on bare metal, we will set the connection string to a predefined value.

        this.mongo_connection_string = process.env.MONGO_CONNECTION_STRING;
        if(this.mongo_connection_string === undefined) {
            this.mongo_connection_string = "mongodb://localhost:27017/";
        }

        this.connection = new MongoClient(this.mongo_connection_string);
    }

    connect = async function() {
        console.log(`Connecting to MongoDB at ${this.mongo_connection_string}`);
        await this.connection.connect();
        console.log("Successfully Connected to MongoDB!");
    }
}

// Create a class using the Singleton design pattern that forces the programmer to access a single instance of the database.
class DBConnectionPool {
    constructor() {
        throw new Error("Error: This is a Singleton object! Use DatabaseConnection.getInstance() instead.");
    }
    static getInstance = async function() {
        if(!DBConnectionPool.instance) {
            DBConnectionPool.instance = new DatabaseConnection();
            try {
                await DBConnectionPool.instance.connect();
            } catch (exception) {
                console.error(exception);
            }
        }
        return DBConnectionPool.instance;
    }
}

module.exports = {DBConnectionPool};
