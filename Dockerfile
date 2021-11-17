# Install dependencies only when needed
FROM node:14-alpine AS deps

RUN apk add --no-cache libc6-compat

# working directory
WORKDIR /app

# copy files
COPY package.json package-lock.json ./

# install dependencies
RUN npm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS builder

# working directory
WORKDIR /app

# copy files
COPY . .

# copy modules
COPY --from=deps /app/node_modules ./node_modules

# build
RUN npm build

# Production image, copy all the files and run next
FROM node:14-alpine AS runner

# working directory
WORKDIR /app

# define port
ARG SERVER_PORT=5000
ENV SERVER_PORT=$SERVER_PORT
EXPOSE $SERVER_PORT

# define env
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# copy files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# define user
USER nextjs

# run project
CMD ["node_modules/.bin/next", "start"]
