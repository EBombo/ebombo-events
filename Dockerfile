# Base
FROM node:14-alpine as builder

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

# Define env
ENV ENV development

# Define port
ARG SERVER_PORT=5000
ENV SERVER_PORT=$SERVER_PORT
EXPOSE $SERVER_PORT

# Define domain
ENV DOMAIN https://red.ebombo.com

# Copy app files
COPY . .

# Create build
RUN npm run build

# Base
FROM node:14-alpine

# Update npm
RUN npm install -g npm@7

# Working directory
WORKDIR /app

# Working directory
WORKDIR /app

# Node env
ENV NODE_ENV production

# Define env
ENV ENV development

# Define port
ARG SERVER_PORT=5000
ENV SERVER_PORT=$SERVER_PORT
EXPOSE $SERVER_PORT

# Define domain
ENV DOMAIN https://red.ebombo.com

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy build
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

# Run
CMD [ "npm" , "start" ]
