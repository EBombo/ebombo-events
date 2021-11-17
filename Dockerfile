# Install dependencies only when needed
FROM node:14-alpine AS deps

RUN apk add --no-cache libc6-compat

# working directory
WORKDIR /app

# copy files
COPY package.json yarn.lock ./

# install dependencies
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS builder

# working directory
WORKDIR /app

# copy files
COPY . .

# copy modules
COPY --from=deps /app/node_modules ./node_modules

# define env
ENV NODE_ENV development

# define domain
ENV DOMAIN=https://red.ebombo.com

# build
RUN yarn build

# Production image, copy all the files and run next
FROM node:14-alpine AS runner

# working directory
WORKDIR /app

# define port
ARG SERVER_PORT=5000
ENV SERVER_PORT=$SERVER_PORT
EXPOSE $SERVER_PORT

# define env
ENV NODE_ENV development

# define domain
ENV DOMAIN=https://red.ebombo.com

# copy files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# run project
CMD ["node_modules/.bin/next", "start"]
