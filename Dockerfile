# Use the official Node.js 16 image as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./
# If you're using yarn, you can copy the yarn.lock file as well
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your application's code to the working directory
COPY . .

# Bind the application to port 8082
EXPOSE 8082

# Define the command to run your app using CMD which defines your runtime
CMD ["yarn", "dev"]
