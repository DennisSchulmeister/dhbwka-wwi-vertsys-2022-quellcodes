# syntax=docker/dockerfile:1
FROM node:17-alpine AS build
WORKDIR /app
COPY run.sh ./
RUN chmod +x run.sh
COPY package.json package-lock.json ./
RUN npm install
COPY src ./src
EXPOSE 3000/tcp
ENTRYPOINT ["/app/run.sh"]
