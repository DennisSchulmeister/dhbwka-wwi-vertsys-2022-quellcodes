import * as dotenv from "dotenv";
import net from "net";

import {Speach} from "./speach.js";

// Serverkonfiguration aus Umgebungsvariablen oder .env-Datei lesen
dotenv.config();

const LISTEN_IP = process.env.SAY_LISTEN_IP || "";
const LISTEN_PORT = parseInt(process.env.SAY_LISTEN_PORT) || 7000;

// Worker Thread für die Sprachausgabe starten
let speach = new Speach();

// Socket-Server starten
let server = net.createServer(socket => {
    // Begrüßungsnachricht an den Client schicken
    socket.setEncoding("utf-8");
    socket.setNoDelay();

    socket.write("HELLO\n");
    socket.write("Allowed commands: SAY some words, STATUS, QUEUE, BYE\n");
    socket.write("\n");

    // Nachrichten des Clients empfangen und verarbeiten
    socket.on("data", data => {
        data = data.replace(/\s+$/g, "");
        let cmd = data.split(" ")[0];
        let val = data.split(" ").slice(1).join(" ");

        console.log(`>> ${data}`);

        switch (cmd) {
            case "SAY":
                // Neuen Satz für die Sprachausgabe vormerken
                speach.say(val);
                break;
            case "STATUS":
                let status = speach.speaking ? "speaking" : "waiting";
                socket.write(`${status}\n`);
                break;
            case "QUEUE":
                // Inhalt der Sprach-Queue zurückliefern
                for (let text of speach.queue) {
                    socket.write(`${text}\n`);
                }

                socket.write("\n");
                break;
            case "BYE":
                // Verbindung trennen
                socket.end();
                break;
            default:
                // Unbekanntes Kommando
                socket.write("?!?\n");
                break;
        }
    });

    socket.on("error", err => console.error(err));
});

console.log(`Server listening on ${LISTEN_IP}:${LISTEN_PORT}`);
server.listen(LISTEN_PORT, LISTEN_IP);

