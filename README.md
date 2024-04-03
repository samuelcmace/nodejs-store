# Node.js Store Application
Full-Stack Store Application Written in Node.js, Express.js, and MongoDB.

Completed in partial fulfillment of the Advanced Database class at UW Green Bay.

# Project Layout

The project is currently structured with the root `index.js` file representing the entrypoint of the application. When this
file is executed on the Node.js runtime, it will access other files within the directory structure of the project in an
as-needed basis.

## Routes

The `/routes` directory stores the content responsible for the setting up the routing information for the project. Some of the routes
used in the project include:
- `/catalog` &ndash; which accepts an incoming HTTP *GET* request and will return an HTML page populated with the current store catalog as defined in the database.
- `/generate-data` &ndash; which accepts an incoming HTTP *POST* request that will populate the database with random catalog data. After finishing, it will return a status page.

## Database

The `/database` directory contains all of the code needed to interact with the database. All interactions with the database
are pre-programmed to go through the `DBConnectionPool` singleton object, which will return a single instance of the `DatabaseConnection`
wherever it is needed in the application. This design pattern was chosen for the database as a means of preventing unnecessary concurrent
connections to the database.
