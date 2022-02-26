# syntax=docker/dockerfile:1
FROM node:17-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY scripts ./scripts
COPY static ./static
COPY src ./src
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080/tcp
