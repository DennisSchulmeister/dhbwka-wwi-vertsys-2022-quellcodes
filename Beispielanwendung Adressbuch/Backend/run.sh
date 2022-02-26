#! /bin/sh

# Einfaches Startskript zum Ausführen der Anwendung innerhalb eines
# Docker-Containers. Setzt ein paar Umgebungsvariablen, damit der
# Server außerhalb des Containers erreichbar ist und sich mit der
# in einem anderen Container laufenden MongoDB verbinden kann.

export HOST=::
export MONGODB=mongodb://mongodb:27017
exec node src/index.js
