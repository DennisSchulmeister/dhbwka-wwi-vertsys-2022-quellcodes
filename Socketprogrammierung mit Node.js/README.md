Socketprogrammierung mit Node.js
================================

 1. [Kurzbeschreibung](#kurzbeschreibung)
 1. [Start der beiden Anwendungen](#start-der-beiden-anwendungen)
 1. [Ausführen mit Docker](#ausführen-mit-docker)

Kurzbeschreibung
----------------

Dieses Projekt zeigt, wie beinahe auf der niedrigsten Ebene eine verteilte Anwendung
mit einfachen TCP/IP-Sockets programmiert werden kann. Die Umsetzung erfolgt mit Node.js
sowohl für einen einfachen Server als einen Client. Der Server implementiert hierbei
einen einfachen „Vorlesedienst“, dem ein beliebiger (englischer) Text zum Vorlesen
auf dem Computerlautsprecher geschickt werden kann.

Das Anwendungsprotokoll basiert auf einfachen Textzeilen. Zunächst schickt der Server
jedem neuen Client eine HELLO-Nachricht sowie eine Liste der von ihm unterstützten
Befehle. Anschließend wartet er in einer Schleife auf die Befehle des Clients, fürhrt
diese aus und sendet daraufhin eine Antwort.

Folgende Konversationen sind dabei vorgesehen:

__Begrüßung:__

  ```
  > HELLO
  > Allowed commands: ...
  >
  ```

__Text vorlesen:__

  ```
  < SAY Hello, world!
  < SAY How are you?
  ```

__Status abfragen:__

  ```
  < STATUS
  > speaking
  < QUEUE
  > How are you?
  >
  < STATUS
  > waiting
  ```

Die spitzen Klammern gehören dabei nicht zum Nachrichtenaustausch, sondern zeigen
hier nur Client (<) und Server (>) an.

Start der beiden Anwendungen
----------------------------

Die beiden Verzeichnisse `Server` und `Client` beinhalten jeweils ein kleines
Node.js-Konsolenprogramm. Auf dem eigenen Rechner muss daher Node.js (oder Docker,
siehe unten) installiert sein, um die Programme ausführen zu können. Zunächst
müssen hierfür die jeweiligen Abhängigkeiten installiert werden:

  ```sh
  cd Server
  npm install

  cd ../Client
  npm install
  ```

Anschließend kann im jeweiligen Verzeichnis `npm start` ausgeführt werden, um
das eigentliche Programm zu starten.

Ausführen mit Docker
--------------------

Mit Hilfe von Docker können die beiden Programme auch ohne dauerhafte Node.js-Installation
ausgeführt werden. Stattdessen können mit folgenden Befehlen zwei temporäre Container 
gestartet werden.

__Server:__

  ```sh
  cd Server
  docket network create saynet
  docker run -it --net saynet -p 7000:7000 -w /app -v "$(pwd):/app" node:17-alpine sh
  ```

__Client:__

  ```sh
  cd ../Client
  docker run -it --net saynet -p 7000:7000 -w /app -v "$(pwd):/app" node:17-alpine bash
  ```

Innerhalb der beiden Container müssen dann die Befehle `npm install` und `npm start`
ausgeführt werden.
