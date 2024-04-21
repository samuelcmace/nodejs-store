# Node.js Store Application

Full-Stack Store Application Written in Node.js, Express.js, and MongoDB.

Completed in partial fulfillment of the Advanced Database class at UW Green Bay.

- [Node.js Store Application](#nodejs-store-application)
  - [Running the Application](#running-the-application)
    - [Docker Compose](#docker-compose)
    - [Bare Metal](#bare-metal)
  - [Project Layout](#project-layout)
    - [Routes](#routes)
      - [Web Routes](#web-routes)
      - [API Routes](#api-routes)
      - [Debug Routes](#debug-routes)
    - [Filters](#filters)
    - [Database Connection](#database-connection)
  - [Environment Variables](#environment-variables)

## Running the Application

There are two primary ways of running the application &ndash; on bare metal or via the Docker Compose containerization
stack. If you utilize Docker Compose, the necessary database instances, their corresponding replication sets, and the
deployment of the web application itself will be taken care of for you. However, if you do not wish to use Docker
Compose, you may manage your own instance of MongoDB and its corresponding replication sets at your own discretion. You
can also choose to host certain parts of the application inside Docker Compose (such as the database) while hosting
other parts (such as the web application) on bare metal &ndash; a process which we will cover more in-depth later on.

### Docker Compose

The recommended way to run the application is using Docker Compose &ndash; a simple container orchestration system
designed for simple projects (much like this one). Working with Docker Compose will require the installation
of [Docker Desktop](https://www.docker.com/products/docker-desktop/) on most platforms or the Docker Engine on Linux (
Other containerization platforms such as
Podman should also work, but are untested).

To install Docker Desktop on Windows via the [Chocolatey package manager](https://chocolatey.org/), execute the
following in an admin PowerShell prompt:

```shell
choco install docker-desktop
```

After installing Docker Desktop (or the Docker Engine), navigate to the project directory and execute the following
commands:

```shell
docker compose build
docker compose up -d
```

This will pull down all the project dependencies and launch them inside running Docker containers on your system
using Docker Compose. It will also handle all the networking for you. Upon opening Docker Desktop, you should now see
the following:

![Docker Compose Cluster Running in Docker Desktop](docs/screenshots/docker_compose.png)

Should you desire to delete the container deployment, you can execute the following commands when located in the project
directory (you can append the `-v` flag to delete the included Docker volumes):

```shell
docker compose down
```

Should you wish to make any changes to the containers, you can repeat this process (deleting the container deployment,
rebuilding it, and redeploying it to Compose), and the instances should be updated accordingly. Additionally, if you
wish only to update the `web_application` container itself (while keeping the other instances up and running), you
can execute the following:

```shell
docker compose up -d --no-deps --build web_application
```

The `--build` flag passed to Docker Compose will re-build the necessary Dockerfile to run the Node.js application and
replace the current `web_application` container with the newly built one.

### Bare Metal

While the Docker Compose wash-rinse-repeat process may be suitable for certain environments, it may not make sense in a
developer workstation environment. In this scenario, it may be tedious and time-consuming to re-build the web
application container every time you desire to re-deploy. In this scenario, it would make sense to only host the
database inside the Docker Compose deployment, while hosting the web application on bare metal. In this section, we will
go over the process by which you can host the application on bare metal.

To do this on Windows, you can install Node.js (and optionally MongoDB should you wish to host that on bare metal as
well) from the [Chocolatey package manager](https://chocolatey.org/). To do this, execute the following in an admin
PowerShell prompt (`mongodb` is optional for Docker Compose hybrid approaches):

```shell
choco install nodejs mongodb
```

Once Node.js is installed, navigate to the project directory and pull down the `npm` dependencies by executing the
following:

```shell
npm install
```

After doing this, you have two choices for the database: you can either choose to manually host them yourself on bare
metal, or use Docker Compose for the database portion (while hosting the web application on bare metal).
If you choose to host the MongoDB instances on bare metal,
the [official MongoDB documentation](https://www.mongodb.com/docs/manual/installation/) should be of great
assistance. However, if you decide to run the database portion inside Docker Compose, you can feel free to comment-out
the web application portion (marked as `web_application`) inside the yaml file and run the Docker Compose stack as
mentioned above.

Then, to run the application using `nodemon`, execute the following in the terminal:

```shell
npm start
```

## Project Layout

The project is currently structured with the root `index.js` file representing the entrypoint of the application. When
this file is executed on the Node.js runtime, it will access other files within the directory structure of the project
on an as-needed basis.

### Routes

The project structure has been broken down into two primary routes: _web_ routes and _API_ routes.

While web routes are intended to be accessed in the web browser, API routes are called by the browser automatically when
the user completes certain actions (such as adding an item to the shopping cart or checking out).

#### Web Routes

The `/routes` directory stores the content responsible for the setting up the routing information for the project. Some
of the routes used in the project include:

- `/catalog` &ndash; which accepts an incoming HTTP *GET* request and will return an HTML page populated with the
  current store catalog as defined in the database.
- `/cart` &ndash; which accepts an incoming HTTP *GET* request and will display the items held in the user's shopping
  cart based on the session.
- `/orders` &ndash; which accepts an incoming HTTP *GET* request and will return an HTML page containing the order
  history of the currently logged-in user.

#### API Routes

API routes are distinguished by two variables: the HTTP method and the "Action" &ndash; a custom HTTP header sent to the
API when making a request which follows the standard HTTP header Pascal case notation.

- `/api/cart` &ndash; accepts many different HTTP requests that are determined by what action the user would like to
  complete. These actions could be adding an item to the shopping cart, removing an item, removing all items, or
  checking out.
- `/api/auth` &ndash; accepts many different HTTP requests that deal with the authentication of the user. This may involve
  registering a new user, logging in a user, or logging a user out of the current session.

#### Debug Routes

The debug routes are composed of a single web route (`/debug`) and multiple API routes that perform various functions
to help test the application in a non-production environment.

These debug routes will be disabled, and the "View Debug Portal" button will disappear on the landing page if the
environment is set to production (the IS_PRODUCTION environment variable is set to true).

### Filters

The authentication filter is set up on _all_ incoming routes except for the authentication and debug portals.
Since the debug portal is disabled in production environments, it does not make sense to attach an authentication filter
to the debug portal.

### Database Connection

The `/database` directory contains all the code needed to interact with the database. All interactions with the database
are pre-programmed to go through the `DBConnectionPool` singleton object, which will return a single instance of
the `DatabaseConnection`wherever it is needed in the application. This design pattern was chosen for the database as a
means of preventing unnecessary concurrent connections to the database.

## Environment Variables

The project features multiple environment variables that help facilitate efficient application management in a wide
array of possible environments and use-cases:

- `HOSTNAME` &ndash; specifies the host on which the application should listen for requests. Default: 0.0.0.0
- `PORT` &ndash; specifies the port on which the application should listen for requests. Default: 3000
- `IS_PRODUCTION` &ndash; specifies whether the application is currently being hosted in a production or non-production
  environment. This environment variable is used to configure the behavior for the debug portal. Default: false
- `MONGO_CONNECTION_STRING` &ndash; specifies the connection string to be used to connect to the MongoDB database. The
  default value for this environment variable depends on how the application is being hosted.
