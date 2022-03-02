#! /bin/sh

# Kleines Wrapper-Skript zum Übernehmen der Backend-URL beim Start des
# Containers. Wurde die URL über die Umgebungsvariable API_URL mitgegeben,
# wird sie in de Datei /usr/share/nginx/html/api.url geschrieben, damit sie
# von der Frontend-App mit einem fetch()-Aufruf abgerufen werden kann.

if [ -n $API_URL ]; then
    echo ">>>> Benutze API-URL: $API_URL"
    echo $API_URL > /usr/share/nginx/html/api.url
fi
