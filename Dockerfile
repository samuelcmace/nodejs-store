# Use the default community-maintained Node.js container from Docker Hub.
FROM node:latest

# Copy the project into the root user's home directory (/root) and set it as the working directory.
WORKDIR /root
COPY . .

# Install the dependencies required to run the project.
# Omit nodemon, since this is a developer dependency and is not needed in a production environment.
RUN npm install --omit=dev

# Set the deployment environment for the container to Docker such that the application knows how to
# interface with the running container.
ENV MONGO_CONNECTION_STRING = "mongodb://localhost:27017/?connect=direct"

# Specify the commands to be executed when the contianer is launched.
CMD [ "node", "index.js" ]
