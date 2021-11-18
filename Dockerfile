# base image
FROM node:14-alpine

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
ENV ENV=production

# define domain
ENV DOMAIN=https://gold.ebombo.com

# create build
RUN npm run build

# start app
CMD [ "npm", "start" ]
