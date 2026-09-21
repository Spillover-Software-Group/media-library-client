# syntax = docker/dockerfile:1

# Keep NODE_VERSION in step with mise.toml and the devEngines in package.json. A floating major
# would hand the container a different npm from the host's, and npm only enforces the pin from
# 10.9 onwards.
ARG NODE_VERSION=22.23.2
ARG DISTRO_NAME=bullseye

FROM node:$NODE_VERSION-$DISTRO_NAME

# Create a directory for the app code
RUN mkdir -p /app
WORKDIR /app

# Document that we're going to expose port 1234
EXPOSE 1234

# Use Bash as the default command
CMD ["/bin/bash"]
