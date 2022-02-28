#! /bin/sh

# Kleines Wrapper-Skript zum Übernehmen der Backend-URL beim Start des
# Containers. Wurde die URL über die Umgebungsvariable API_URL mitgegeben,
# wird sie in de Datei /usr/share/nginx/html/api.url geschrieben, damit sie
# von der Frontend-App mit einem fetch()-Aufruf abgerufen werden kann.
# Danach wird der Container-Start wie gehabt fortgeführt, indem das Skript
# /docker-entrypoint.sh, das vom nginx-Basiscontainer bereitgestellt wird,
# ausgeführt wird. (Dies wurde mit `docker inspect nginx` ermittelt).

if [ -n $API_URL ]; then
    echo $API_URL > /usr/share/nginx/html/api.url
fi

echo "$@"
exec /docker-entrypoint.sh "$@"
