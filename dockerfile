# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Final Stage
FROM node:20-alpine

# Install dos2unix before anything else
RUN apk add --no-cache dos2unix

ARG NODE_ENV=${NODE_ENV}
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

# Copy build output 
COPY --from=builder /app/dist ./dist

# Copy correct env file
COPY .env.${NODE_ENV} .env

# Copy entrypoint script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Copy entrypoint script
COPY entrypoint.sh ./entrypoint.sh

# Convert entrypoint.sh to Unix line endings to avoid ^M issues
RUN dos2unix ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT ["./entrypoint.sh"]


