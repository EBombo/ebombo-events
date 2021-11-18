# base image
FROM node:alpine

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# create folder
RUN mkdir /app

# working directory
WORKDIR /app

# add binaries to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# copy app files and build
COPY . /app

# install dependencies
RUN npm install --force

# define port
ARG SERVER_PORT=5000
ENV SERVER_PORT=$SERVER_PORT
EXPOSE $SERVER_PORT

# define env
ENV NODE_ENV=development

# define domain
ENV DOMAIN=https://red.ebombo.com

# create build
RUN npm run build

# start app
CMD [ "node_modules/.bin/next" , "start" , "-p 5000"]
