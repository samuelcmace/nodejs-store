# Node.js Store Application

Full-Stack Store Application Written in Node.js, Express.js, and MongoDB.

Completed in partial fulfillment of the Advanced Database class at UW Green Bay.

# Running the Application

There are two primary ways of running the application &ndash; on bare metal or via the Docker Compose containerization stack.

## Docker Compose

The recommended way to run the application is using Docker Compose &ndash; a simple container orchestration system designed for simple projects (much like this one). Working with Docker Compose will require the installation of [Docker Desktop](https://www.docker.com/products/docker-desktop/) on most platforms. On Windows, this can be accomplished via the [Chocolatey package manager](https://chocolatey.org/) in an admin PowerShell prompt:

```shell
choco install docker-desktop
```

After installing Docker Desktop (or the Docker Engine), navigate to the project directory and execute the following commands:

```shell
docker compose build
docker compose up
```

This will pull down all of the project dependencies and launch them inside running Docker containers on your system using Docker Compose. It will also handle all the networking for you. Upon opening Docker Desktop, you should now see the following:

![Docker Compose Cluster Running in Docker Desktop](docs/screenshots/docker_compose.png)

## Bare Metal (Unsupported)

Another way to run the application is on bare metal, which can be accomplished by manually installing MongoDB and Node.JS. To accomplish this on Windows
using the [Chocolatey package manager](https://chocolatey.org/), execute the following in an admin PowerShell prompt:

```shell
choco install mongodb nodejs
```

Once Node.js is installed, navigate to the project directory and pull down the `npm` dependencies by executing the following:

```shell
npm install
```

Since the bare metal route is not officially supported, it is expected that you already know how to install MongoDB and get the necessary authentication setup. With that in mind, you may need to tinker around with the MongoDB connection strings to fit your unique setup.

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
