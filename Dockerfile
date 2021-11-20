# Base
FROM node:14-alpine

# Update npm
RUN npm install -g npm@7

# Working directory
WORKDIR /app

# Working directory
WORKDIR /app

# Copy app files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --force

# Node env
ENV NODE_ENV production

# Define port
ARG SERVER_PORT=5000
ENV SERVER_PORT=$SERVER_PORT
EXPOSE $SERVER_PORT

# Copy app files
COPY . .

# Create build
RUN npm run build

# Run
CMD [ "npm" , "start" ]
