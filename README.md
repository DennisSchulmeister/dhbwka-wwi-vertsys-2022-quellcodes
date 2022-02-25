Aufgaben und Beispiele für die Vorlesung "Verteilte Systeme (ab 2022)"
======================================================================

Kurzbeschreibung
----------------

Dieses Repository beinhaltet sämtliche Vorlagen, Aufgaben und Beispiele für
die Vorlesung „Verteilte Systeme” (ab Studienjahr 2022) im Studiengang
Wirtschaftsinformatik an der DHBW Karlsruhe. Die Quellcodes werden im
[Vorlesungsskript](https://www.wpvs.de/repo/vertsys-2022/skript/) behandelt.

Hauptsächlich dienen die Quellcodes als Vorlage zur Entwicklung cloudfähiger
Webanwendungen, die als clientseitige Single Page Apps mit REST-Backend
ausgeführt werden. Großer Wert wird auf eine Balance zwischen modernen
Entwicklungsmethoden und einer für Studierende beherschbaren Komplexität
gelegt:

 * Davon ausgehend, dass die meisten Studierenden erst durch das Studium
   praktische Erfahrungen in der Webentwicklung sammeln, nutzt der Clientteil
   Vanilla-JavaScript ohne Framework, da ein Framework die zu beherschende
   Komplexität deutlich erhöhen würde.

 * Der Einsatz moderner Sprachfeatures von JavaScript sowie verschiedener
   Best Practices zeigen dennoch, wie moderne Anwendungen entwickelt werden
   können.

 * Serverseitig kommt ebenfalls JavaScript in Form von nodeJS, Restify und
   MongoDB zum Einsatz. Entscheidend für diese Auswahl sind die erprobte
   Praxistauglichkeit bei relativ einfacher Einstiegsmöglichkeit.

 * Externe Abhängigkeiten werden mit npm verwaltet und esbuild als Bundler
   den Frontend-Anwendungen zugänglich gemacht. Backendseitig wird kein
   Bundler genutzt, da diese stellenweise zwar sinnvoll aber nicht zwingend
   notwendig ist.

 * Docker und Docker Compose ermöglichen es, die notwendige Systemlandschaft
   zum Entwickeln und Ausführen der Anwendungen deklarativ zu beschreiben und
   zuverlässig herzustellen.

Copyright
---------

Sämtliche Quellcodes sind lizenziert unter
[_Creative Commons Namensnennung 4.0 International_](http://creativecommons.org/licenses/by/4.0/)

© 2022 Dennis Schulmeister-Zimolong im Auftrag der DHBW Karlsruhe <br/>

E-Mail: [dhbw@windows3.de](mailto:dhbw@windows3.de) <br/>
Webseite: https://www.wpvs.de
