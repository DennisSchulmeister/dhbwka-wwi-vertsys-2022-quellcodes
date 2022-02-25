Adressbuch: Frontend
====================

Dies ist die clientseitige Single Page App mit dem Frontend des Adressbuchs.
Es handelt sich dabei um eine einfache Webanwendung, die mit VanillaJS
(also einfachem JavaScript) ohne zusätzlichem Framework realisiert wurde.

Während der Entwicklung wird eine nodeJS-Laufzeitumgebung benötigt. Produktiv
reicht ein beliebiger Webserver zur Auslieferung statischer Dateien. Die
folgenden Konsolenbefehler helfen bei der Entwicklung:

 * `npm install` zur Installation aller benötigten Module
 * `npm update` zur Aktualisierung aller Abhängigkeiten
 * `npm start` zum Starten eines Entwicklungsservers auf Port 8080
 * `npm run build` zum Bauen der Anwendung für den Produktivbetrieb
 * `npm run clean` zum Löschen des Build-Verzeichnisses

Die mit `npm run build` gebaute Anwendung wird im Verzeichnis `build` abgelegt
und kann von dort auf einen beliebigen Webserver hochgeladen werden.

Falls keine lokale nodeJS-Umgebung zur Verfügung steht, kann mit folgendem
Befehlen ein Docker-Container zur Ausführung der obigen Kommandos gestartet
werden. Der Befehl öffnet eine Kommandozeile innerhalb des Containers, in
die die obigen Befehle eingegeben werden können:

```sh
docker run -it -p 8080:8080 -w /app -v "$(pwd):/app" node:12-alpine sh
```

Mit dem Befehl `exit` kann die Kommandozeile des Containers verlassen werden.
Der Container wird dadurch automatisch gestoppt.

Für den Produktivbetrieb konfiguriert das beigefügte `Dockerfile` einen
`nginx`-Webserver, der in einer beliebigen Cloudumgebung mit Unterstützung
für Containervirtualisierung ausgeführt werden kann. Folgende Befehle werden
hierfür benötigt:s

 * `docker build -t adressbuch-frontend .` zum Bauen des Containers
 * `docker run -d -p 8080:80 --name frontend adressbuch-frontend` zum Ausführen des Containers
 * `docker container stop frontend` zum Stoppen des Containers
 * `docker container prune` zum Aufräumen alter Container-Dateien
 * `docker image prune` zum Aufräumen alter Image-Dateien

Alternativ kann die im Wurzelverzeichnis abgelegte Datei `docker-compose.yml`
genutzt werden, um alle Teile der Anwendung mit Docker im Entwicklungs- oder
Produktivmodus zu starten.

Siehe [Docker Getting Started Guide](https://docs.docker.com/get-started/)
führ ein ausführliches Tutorial zur Nutzung von Docker während der Entwicklung.
