# syntax=docker/dockerfile:1
FROM node:17-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY src ./src
EXPOSE 3000/tcp
ENV HOST=:: MONGODB=mongodb://mongodb:27017
ENTRYPOINT ["node", "src/index.js"]
