const {MongoClient} = require("mongodb");

// Create a class to represent a connection to the MongoDB database.
class DatabaseConnection {
    mongo_connection_string = "mongodb://admin:admin@localhost:27017/";
    databaseConnection = new MongoClient(mongo_connection_string);

    // Function to set up the MongoDB database connection.
    connect = async function() {
        console.log("Connecting to MongoDB...");
        await databaseConnection.connect();
        console.log("Successfully Connected to MongoDB!");
    }

    constructor() {
        connect();
    }
}

// Create a class using the Singleton design pattern that forces the programmer to access a single instance of the database.
class DBConnectionPool {
    constructor() {
        throw new Error("Error: This is a Singleton object! Use DatabaseConnection.getInstance() instead.");
    }
    static getInstance() {
        if(!DBConnectionPool.instance) {
            DBConnectionPool.instance = new DatabaseConnection();
        }
        return DBConnectionPool.instance;
    }
}

module.exports = {DBConnectionPool};
