# syntax=docker/dockerfile:1
FROM node:17-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY src ./src
CMD ["node", "src/index.js"]
