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
ARG NEXT_PUBLIC_NODE_ENV
ENV NEXT_PUBLIC_NODE_ENV production

# Define env
ARG NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_ENV production

# Define port
ARG SERVER_PORT=5000
ARG NEXT_PUBLIC_SERVER_PORT
ENV NEXT_PUBLIC_SERVER_PORT=$SERVER_PORT
EXPOSE $SERVER_PORT

# Define domain
ARG NEXT_PUBLIC_DOMAIN
ENV NEXT_PUBLIC_DOMAIN https://gold.ebombo.com

# Copy app files
COPY . .

# Create build
RUN npm run build

# Run
CMD [ "npm" , "start" ]
