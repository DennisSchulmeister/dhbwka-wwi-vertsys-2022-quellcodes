# syntax=docker/dockerfile:1

FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d

# Ggf. hier weitere COPY-Anweisungen einbauen, um statische Webinhalte nach
# /usr/share/nginx/html zu kopieren, falls der Gateway-Server auch eine
# statische Webseite (z.B. mit API-Dokumentationen, einer Landing Page, ...)
# bereitstellen soll.
