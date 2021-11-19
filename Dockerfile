# Install dependencies
FROM node:14-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Build project
FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

# node env
ENV NODE_ENV production
# define env
ENV ENV development
# define port
ARG SERVER_PORT=5000
ENV SERVER_PORT=$SERVER_PORT
# define domain
ENV DOMAIN https://red.ebombo.com

RUN npm run build

# Run project
FROM node:14-alpine AS runner
WORKDIR /app

# node env
ENV NODE_ENV production
# define env
ENV ENV development
# define port
ARG SERVER_PORT=5000
ENV SERVER_PORT=$SERVER_PORT
EXPOSE $SERVER_PORT
# define domain
ENV DOMAIN https://red.ebombo.com

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 5000

CMD ["npm", "start"]
