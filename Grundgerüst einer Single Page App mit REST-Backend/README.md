Grundgerüst: SPA mit REST-Backend
=================================

__TODO: Dokument überarbeiten__

Inhaltsverzeichnis
------------------

 1. [Kurzbeschreibung](#kurzbeschreibung)
 1. [Nutzung der Gitpod Online-IDE](#nutzung-der-gitpod-online-ide)
 1. [Start mit Docker Compose](#start-mit-docker-compose)
 1. [Start einzelner Services mit und ohne Docker](#start-einzelner-services-mit-und-ohne-docker)
 1. [Hinwes zu Podman unter Linux](#hinweis-zu-podman-unter-linux)

Kurzbeschreibung
----------------

Bei diesem Projekt handelt es sich um eine vom Adressbuchbeispiel abgeleitete
Vorlage, die Sie zur Erstellung eigener Single Page Apps mit REST-Backend
verwenden können. Im Gegensatz zum Original werden hier nicht Adressen sondern
Beispiele verwaltet. :-) Zum Übernehmen gehen Sie wie folgt vor:

 1. Kopieren Sie den Inhalt dieses Verzeichnisses in ein neues Verzeichnis
    für die zu erstellende App (außerhalb dieses Git-Repositories)

 1. Kopieren Sie die Datei `.gitignore` aus dem Wurzelverzeichnis dieses
    Git-Repositories in das eben kopierte Verzeichnis.

 1. Legen Sie ein neues Git-Repository an und commited Sie den kopierten
    Quellcode. Bei Bedarf laden Sie das Repository auf GitHub hoch.

 1. Lesen Sie sich die README-Dateien, den Quellcode und die darin enthaltenen
    Kommentare sorgfältig durch.

 1. Suchen Sie mit Ihrem Editor nach allen Vorkommen des Worts TODO im
    gesamten Quellverzeichnis, um die anzupassenden Stellen zu ermitteln.

 1. Passen Sie die README-Dateien an oder ersetzen diese durch eigene Dateien.

Mit Docker und Docker Compose können die Bestandteile der App einzeln oder
als Gesamtprojekt ausgeführt werden.

Nutzung der Gitpod Online-IDE
----------------------------

Falls Sie auf Ihrem Rechner gar keine Software installieren können oder die
Installation von Docker nicht geklappt hapt (bspw. weil Sie die Home-Edition
von Microsoft Windows nutzen), können Sie das Beispiel auch in der GitPod
Online-IDE bearbeiten. Diese stellt Ihnen neben der IDE auch eine Linux-Umgebung
mit vorinstallierten Werkzeugen für Docker und Node.js zur Verfügung, so dass
Sie alle hier gezeigten Befehle direkt ausführen können. Gehen Sie hierfür
wie folgt vor:

 1. Importieren Sie den Quellcode in ein neues Git-Repository.
 1. Laden Sie das Git-Repository auf GitHub hoch und machen es public.
 1. Rufen Sie die Startseite des Git-Repositories in GitHub auf.
 1. Schreiben Sie `https://gitpod.io/#` vor die GitHub-URL, um die IDE zu starten.

Innerhalb der Online-IDE können Sie über das Menü ein neues Terminal öffnen,
in dem alle Befehle ausgeführt werden können. Dabei müssen Sie lediglich
darauf achten, die TCP-Ports aller ausgeführten Serverdienste (z.B. für die
MongoDB oder den Backend-Webservice) auf der linken Seite über den sog.
„Remote Explorer” freizuschalten und somit über eine öffentliche URL
zugänglich zu machen:

![Remote Explorer in der Gitpod Online-IDE](gitpod1.png)

Indem Sie dann das Preview-Icon direkt neben der Freigabe anklicken, öffnet sich
im selben Browser-Tab ein neuer Bereich mit einem eingebetteten Browser-Fenster.

![Vorschau des Backend-Service in GitPod](gitpod2.png)

Dort können Sie sich vom Backend-Service mit der Portnummer 3000 die öffentliche
URL kopieren. Diese sollten Sie vor Start aller Services als Umgebungsvariable
API_URL exportieren. Achten Sie dabei darauf, dass die URL keinen abschließenden
Slash beinhalten darf!

```sh
export API_URL=https://3000-….gitpod.io
```

Anschließend sollte alles wie es soll funktionieren.

Start mit Docker Compose
------------------------

Das Wurzelverzeichnis beinhaltet zwei Docker Compose Files, mit denen die
Anwendung im Entwicklungs- oder Produktivmodus gestartet werden kann:

 * `docker-compose.dev.yml`: Entwicklungsmodus mit folgenden Diensten:

     1. MongoDB (von Außen nicht erreichbar)
     2. MongoDB Admin GUI (erreichbar auf http://localhost:8081)
     3. Backend (erreichbar auf http://localhost:3000)
     4. Frontend (erreichbar auf http://localhost:8080)

 Frontend und Backend führend den lokalen Quellcode in einer einfachen
 Node.js-Laufzeitumgebung aus. Änderungen werden dadurch sofort aktiv, wobei
 sich das Backend bei einer Änderung automatisch neustartet und bei einer
 Änderung am Frontend einfach nur die Seite im Browser neugeladen werden
 muss.

 * `docker-compose.prod.yml`: Produktivmodus mit folgenden Diensten:

     1. MongoDB (von Außen nicht erreichbar)
     2. Backend (von Außen nicht erreichbar)
     3. Frontend (von Außen nicht erreichbar)
     4. Gateway (erreichbar auf http://localhost:8080)

Im Unterschied zum Entwicklungsmodus werden hier anhand der in den jeweiligen
Verzeichnissen abgelegten Datei `Dockerfile` eigenständige Container Images
für Frontend und Backend gebaut und ausgeführt. Der Quellcode wird hierfür
einmalig in die Images hinein kopiert, so dass Änderungen daran erst wirksam
werden, wenn die Images neu erstellt werden. Dies kann entweder in den
jeweiligen Verzeichnissen manuell oder durch Neustarten von Docker Compose
erreicht werden.

Ebenso sind die meisten Services in dieser Version von Außen nicht mehr
erreichbar, sondern hinter einem Gateway-Server versteckt. Die Architektur
sieht somit in etwa so aus:

```mermaid
graph LR
    E(Externe Aufrufer) --> G[Gateway];
    G[Gateway] --> F[Frontend];
    G[Gateway] --> B[Backend];
    B[Backend] --> M[MongoDB];
```

Das Vorgehen zum Starten und Stoppen der Anwendung ist für beide Modus gleich.
Lediglich der Dateiname muss in den folgenden Befehlen angepasst werden:

 * `docker-compose -f docker-compose.dev.yml up -d` zum Starten aller Dienste
 * `docker-compose -f docker-compose.dev.yml down` zum Stoppen aller Dienste
 * `docker system prune` zum Aufräumen nicht mehr benötigter Dateien

Im Falle der Produktivversion werden die Container für Frontend und Backend von
Docker Compose nur einmalig gebaut, dann aber nicht mehr erneut gebaut, wenn
sich der zugrunde liegende Quellcode verändert. Vor der nächsten Ausführung
müssen sie daher bei einer Änderung mit folgendem Befehl erneut gebaut werden:

```sh
docker-compose -f docker-compose.prod.yml build
```

In der Produktivversion kann durch Setzen der Umgebungsvariable API_URL die
Adresse des Backendservices definiert werden, mit der sich das Frontend zu
verbinden versucht:

```sh
export API_URL=http://api.beispiel.de
docker-compose -f docker-compose.prod.yml up -d
```

Dies Funktioniert, indem die Umgebungsvariable in der `docker-compose.prod.yml`
an die gleichnamige Umgebungsvariable des Frontend-Containers übergeben und
bei dessen Start durch ein Startskript ausgewertet wird. Das Skript schreibt
den Inhalt in eine statische Datei, die das Frontend unter der Addresse
`api.url` abrufen kann. Der Mechanismus ist im Grunde genommen derselbe, wie
Docker ihn für "Secrets" und "Configs" bereitstellt. Auch diese werden einfach
über eine Datei im Container sichtar gemacht. Leider bietet Docker diese
Funktion aber nur in Zusammenhang mit Docker Swarm an. Zwar lässt sich die
App unverändert auch mit Docker Swarm ausführen, dies wird hier allerdings
absichtlicht nicht beschrieben, da es auf Docker Compose aufbaut und Docker
Compose davon abgesehen für uns zunächst ausreicht.

Start einzelner Services mit und ohne Docker
--------------------------------------------

Die README-Dateien in den jeweiligen Unterverzeichnissen beschrieben, wie die
einzelnen Services mit und ohne Docker jeweils einzeln ausgeführt werden können,
um diese in Isolation zu testen. In der Regel ist jedoch einfacher, mit Docker
Compose eine komplette Entwicklungsumgebung zu starten und darauf los zu
programmieren.

Hinweis zu Podman unter Linux
-----------------------------

Unter Linux hat sich inzwischen Podman als verbreitete Alternative zu Docker
durchgesetzt, u.a. weil es ohne Root-Rechte und einen im Hintergrund laufenden
Daemon-Prozess auskommt. Alle in diesem Projekt gezeigte Befehle funktionieren
nahezu unverändert auch mit Podman. Es muss lediglich `docker` durch `podman`
bzw. `docker-compose` durch `podman-compose` ersetzt werden.
