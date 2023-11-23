# FROM node:14-slim also works here
FROM node:14-alpine as base

# Create and set the working directory
WORKDIR /usr/src/app

# Commands needed to download a bash script to wait until rabbitmq is ready

RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Define the command to run your app
CMD ["npm", "start"]