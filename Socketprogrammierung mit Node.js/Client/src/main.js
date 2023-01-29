import * as dotenv from "dotenv";
import net from "net";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

dotenv.config();
const LISTEN_IP = process.env.SAY_LISTEN_IP || "";
const LISTEN_PORT = parseInt(process.env.SAY_LISTEN_PORT) || 7000;

let connected = false;
let abortUserInput = new AbortController();

console.log(`Connecting to ${LISTEN_IP}:${LISTEN_PORT}`);

let socket = net.createConnection({host: LISTEN_IP, port: LISTEN_PORT}, async () => {
    connected = true;

    console.log("Connection successful!");
    console.log("");
    console.log("=========");
    console.log("MAIN MENU");
    console.log("=========");
    console.log("");
    console.log("  [1] Say something");
    console.log("  [2] Get server status");
    console.log("  [3] Get queued messages");
    console.log("  [Q] Quit");
    console.log("");

    const rl = readline.createInterface({ input, output });

    while (connected) {
        let choice = "";
        abortUserInput = new AbortController();

        try {
            choice = await rl.question("Your choice: ", {signal: abortUserInput.signal});
        } catch {
            // Abbruch wegen Konsolenausgabe des Sockets einfach ignorieren
        }

        switch (choice) {
            case "1":
                try {
                    let text = await rl.question("Message to say: ", {signal: abortUserInput.signal});
                    socket.write(`SAY ${text}`);
                } catch {
                    // Abbruch wegen Konsolenausgabe des Sockets einfach ignorieren
                }
                break;
            case "2":
                socket.write("STATUS\n");
                break;
            case "3":
                socket.write("QUEUE\n");
                break;
            case "Q":
            case "q":
                connected = false;
                socket.write("BYE\n");
                break;
            case "":
                break;
            default:
                console.log("Invalid choice. Please retry.");
        }
    }

    rl.close();
});

socket.on("data", data => {
    console.log(`\n${data.toString()}`);
    abortUserInput.abort();
});

socket.on("error", err => {
    console.error("\n", err)
    abortUserInput.abort();
});

socket.on("end", () => connected = false);
