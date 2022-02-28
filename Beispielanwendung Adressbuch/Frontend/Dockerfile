# syntax=docker/dockerfile:1

#-------------------------------------------------------------------------------
# Schritt 1: Deploybare App bauen (in einem temporären Container)
#-------------------------------------------------------------------------------
FROM node:17-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY scripts ./scripts
COPY static ./static
COPY src ./src
RUN npm run build

#-------------------------------------------------------------------------------
# Schritt 2: Den eigentlichen Container bauen
#-------------------------------------------------------------------------------
FROM nginx:alpine

# Backend-URL via Umgebungsvariable API_URL setzbar machen.
# Leider erfordert dies nicht nur ein eigenes kleines Wrapper-Skript, sondern
# auch, dass das ursprüngliche Skript vom Basiscontainer manuell aufgerufen
# und die CMD-Anweisung hier wiederholt werden muss.
COPY docker-entrypoint-wrapper.sh /
RUN chmod +x /docker-entrypoint-wrapper.sh
ENTRYPOINT ["/docker-entrypoint-wrapper.sh"]
CMD ["nginx", "-g", "daemon off;"]

COPY --from=build /app/build /usr/share/nginx/html
