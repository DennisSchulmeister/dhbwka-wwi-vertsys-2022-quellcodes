Aufgabe: Hey, Mr. Postman
=========================

Inhaltsverzeichnis
------------------

1. [Kurzbeschreibung](#kurzbeschreibung)
1. [Start mit Docker Compose](#start-mit-docker-compose)
1. [Node.js-Kommandozeilenbefehle](#nodejs-kommandozeilenbefehle)

Kurzbeschreibung
----------------

Dies ist ein einfacher REST-Webservice für die Aufgabe "Hey, Mr. Postman" in
den Vorlesungsfolien. Der Webservice ist als Node.js-Projekt mit dem Framework
[Restify](http://restify.com/) entworfen und verwaltet einfach ein paar Daten
über Songs in einer Mongo-Datenbank. Die Schnittstelle des Webservices ist in
der Datei `src/api/openapi.yaml` beschrieben.

Sinn der Aufgabe ist, den Webservice mit einem Werkzeug wie [Postman](https://www.postman.com/)
zu testen und dabei praktisch auszuprobieren, wie typische Anfragen an einen
REST-Webservice aussehen bzw. wiedas HTTP-Übertragungsprotokolls dabei konkret
eingesetzt wird. Insbesondere die Bedeutung der verschiedenen HTTP Verben und
die hierarchische Struktur der URL-Endpunkte sollen dabei erprobt werden.

Start mit Docker Compose
------------------------

Am einfachsten lässt sich die App mit Docker Compose starten:

 * `docker-compose -f docker-compose.dev.yml up -d` zum Starten aller Dienste
 * `docker-compose -f docker-compose.dev.yml down` zum Stoppen aller Dienste
 * `docker system prune` zum Aufräumen nicht mehr benötigter Dateien

Node.js-Kommandozeilenbefehle
-----------------------------

Dieser Service nutzt Node.js bzw. den Node Package Manager zur Verwaltung von
Abhängigkeiten (im Quellcode verwendete, externe Bibliothekten und Frameworks)
und seiner Ausführung. Hierfür stehen folgende Kommandozeilenbefehle zur
Verfügung:

 * `npm install` zur Installation aller benötigten Module
 * `npm update` zur Aktualisierung aller Abhängigkeiten
 * `npm start` zum Starten eines Entwicklungsservers auf Port 3000

Dank `nodemon` werden Änderungen am Quellcode werden sofort aktiv, indem der
Service automatisch neugestartet wird. Zusätzlich kann der Standardport 9229
zur Anbindung eines JavaScript-Debuggers verwendet werden.
