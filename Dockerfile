# syntax = docker/dockerfile:1

ARG NODE_MAJOR=16
ARG DISTRO_NAME=bullseye

FROM node:$NODE_MAJOR-$DISTRO_NAME

RUN npm install -g npm@latest

# Create a directory for the app code
RUN mkdir -p /app
WORKDIR /app

# Document that we're going to expose port 1234
EXPOSE 1234

# Use Bash as the default command
CMD ["/bin/bash"]
