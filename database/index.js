const {MongoClient} = require("mongodb");

// Create a class to represent a connection to the MongoDB database.
class DatabaseConnection {
    static {
        // If the environment in which the application is being executed is inside Docker Compose, set the
        // hostname for the MongoDB database to "database" -- which is created and managed by the Docker Compose
        // Networking stack. If the application is being launched inside a container but the database is being
        // accessed on the host, use the "host.docker.internal". Otherwise, if both Node.js and the database
        // are being run on bare metal, set the hostname to "localhost".

        let mongodb_hostname;
        if(process.env.DEPLOYMENT === "docker-compose") {
            mongodb_hostname = "database";
        } else if(process.env.DEPLOYMENT === "docker") {
            mongodb_hostname = "host.docker.internal";
        } else {
            mongodb_hostname = "localhost";
        }

        let mongo_connection_string = `mongodb://admin:admin@${mongodb_hostname}:27017/`;
        let databaseConnection = new MongoClient(mongo_connection_string);
    }

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
