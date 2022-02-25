Addressbuch: Backend
====================

Dies ist der backendseitige REST-Webservice der Addressbuch-App. Es handelt
sich um ein einfaches nodeJS-Projekt mit dem Webframework "Restify". Die
Schnittstelle des Webservices ist in der Datei `src/api/openapi.yaml`
beschrieben.

Zur Ausführung des Backendservices wird eine nodeJS-Laufzeitumgebung benötigt.
Ist diese vorhanden, stehen folgende Befehle zur Verfügung:

 * `npm install` zur Installation aller benötigten Module
 * `npm update` zur Aktualisierung aller Abhängigkeiten
 * `npm start` zum Starten eines Entwicklungsservers auf Port 3000

Falls keine lokale nodeJS-Umgebung zur Verfügung steht, kann mit folgendem
Befehlen ein Docker-Container zur Ausführung der obigen Kommandos gestartet
werden. Der Befehl öffnet eine Kommandozeile innerhalb des Containers, in
die die obigen Befehle eingegeben werden können:

```sh
docker run -it -p 3000:3000 -w /app -v "$(pwd):/app" node:12-alpine sh
```

Mit dem Befehl `exit` kann die Kommandozeile des Containers verlassen werden.
Der Container wird dadurch automatisch gestoppt.

Zusätzlich wird eine MongoDB-Datenbank benötigt, die mit folgendem Befehl
gestartet werden kann:

```sh
docker run --name mongodb -d -p 27017:27017 mongo
```

Für den Produktivbetrieb konfiguriert das beigefügte `Dockerfile` eine
nodeJS-Laufzeitumgebung, die in einer beliebigen Cloudumgebung mit Unterstützung
für Containervirtualisierung ausgeführt werden kann. Folgende Befehle werden
hierfür benötigt:s

 * `docker build -t adressbuch-backend .` zum Bauen des Containers
 * `docker run -d -p 3000:3000 --name backend adressbuch-backend` zum Ausführen des Containers
 * `docker container stop backend` zum Stoppen des Containers
 * `docker container prune` zum Aufräumen alter Container-Dateien
 * `docker image prune` zum Aufräumen alter Image-Dateien

Alternativ kann die im Wurzelverzeichnis abgelegte Datei `docker-compose.yml`
genutzt werden, um alle Teile der Anwendung mit Docker im Entwicklungs- oder
Produktivmodus zu starten.

Siehe [Docker Getting Started Guide](https://docs.docker.com/get-started/)
führ ein ausführliches Tutorial zur Nutzung von Docker während der Entwicklung.
