"use strict"

import restify from "restify";
import DatabaseFactory from "./database.js";
import RootController from "./controller/root.controller.js";
import AdressController from "./controller/address.controller.js";

/* =============================================================================
 * SERVER-KONFIGURATION
 * =============================================================================*/

// Auslesen der Umgebungsvariablen zur Konfiguration des Servers
const config = {
    port:    parseInt(process.env.PORT) || 3000,
    host:    process.env.HOST           || "localhost",
    mongodb: process.env.MONGODB        || "mongodb://localhost:27017",
};

await DatabaseFactory.init(config.mongodb);

/* =============================================================================
 * SERVER STARTEN
 * =============================================================================*/
var server = restify.createServer({
    // Bei Bedarf notwendige Serverkonfiguration hier erweitern.
    // Vgl. http://restify.com/docs/server-api/#createserver
});

// Protokollzeile für jede HTTP-Anfrage auf der Konsole ausgeben
server.pre((req, res, next) => {
    console.log(new Date(), req.method, req.url, `HTTP ${req.httpVersion}`);
    return next();
});

// CORS-Header setzen, um Zugriffe von anderen URLs außer der Backend-URL zuzulassen.
// Außerdem OPTIONS-Anfragen (sog. CORS-Preflight) immer mit Status 200 beantworten,
// damit die Browser ändernde Aufrufe tatsächlich durchführen.
server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
    res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
    return next();
});

server.opts("*", (req, res, next) => {
    res.status(200);
    res.send({});
    next();
})

// Sonstige Restify-Plugins aktivieren
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.dateParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonp());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.throttle({burst: 100, rate: 50, ip: true}));
server.use(restify.plugins.conditionalRequest());

// HTTP-Controller registrieren
new RootController(server, "/");
new AdressController(server, "/address");

// Server tatsächlich starten
server.listen(config.port, config.host, function() {
    console.log("=================");
    console.log("Adressbuch-Server");
    console.log("=================");
    console.log();
    console.log("Ausführung mit folgender Konfiguration:");
    console.log();
    console.log(config);
    console.log();
    console.log("Nutzen Sie die folgenden Umgebungsvariablen zum Anpassen der Konfiguration:");
    console.log();
    console.log("  » PORT:    TCP-Port, auf dem der Webserver erreichbar ist");
    console.log("  » HOST:    Hostname oder IP-Addresse, auf welcher der Webserver erreichbar ist");
    console.log("  » MONGODB: URL-String mit den Verbindungsdaten zur Mongo-Datenbank");
    console.log();
});
