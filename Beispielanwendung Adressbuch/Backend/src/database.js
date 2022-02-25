"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("adressbook");

        // Demodaten anlegen
        let addresses = this.database.collection("addresses");

        if (await addresses.estimatedDocumentCount() === 0) {
            addresses.insertMany([
                {
                    first_name: "Willy",
                    last_name: "Tanner",
                    phone: "+49 711 564412",
                    email: "willy.tanner@alf.com",
                },
                {
                    first_name: "Michael",
                    last_name: "Knight",
                    phone: "+49 721 554194",
                    email: "michael@knight-rider.com",
                },
                {
                    first_name: "Fox",
                    last_name: "Mulder",
                    phone: "+49 721 553181",
                    email: "mulder@xfiles.com",
                },
                {
                    first_name: "Dana",
                    last_name: "Scully",
                    phone: "+49 721 572287",
                    email: "scully@xfiles.com",
                },
                {
                    first_name: "Elwood",
                    last_name: "Blues",
                    phone: "+49 721 957338",
                    email: "elwood@blues-brothers.com",
                },
            ]);
        }
    }
}

export default new DatabaseFactory();
