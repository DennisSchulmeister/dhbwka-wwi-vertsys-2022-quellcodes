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
        this.database = this.client.db("app_database");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        let songs = this.database.collection("songs");

        if (await songs.estimatedDocumentCount() === 0) {
            songs.insertMany([
                {artist: "Elton John",   name: "Goodbye Yellow Brick Road", release_year: 1973,  songwriters: "Bernie Taupin, Elton John"},
                {artist: "Elton John",   name: "Candle In The Wind",        release_year: 1973,  songwriters: "Bernie Taupin, Elton John"},
                {artist: "Elton John",   name: "Blue Wonderful",            release_year: 2016,  songwriters: "Bernie Taupin, Elton John"},
                {artist: "Dire Straits", name: "Brothers In Arms",          release_year: 1985,  songwriters: "Mark Knopfler"},
                {artist: "Dire Straits", name: "Calling Elvis",             release_year: 1991,  songwriters: "Mark Knopfler"},
                {artist: "The Eagles",   name: "Tequila Sunrise",           release_year: 1973,  songwriters: "Don Henley, Glenn Frey"},
                {artist: "The Eagles",   name: "Busy Being Fabulous",       release_year: 2007,  songwriters: "Don Henley, Glenn Frey"},
                {artist: "O.M.D.",       name: "Walking On The Milkiway",   release_year: 1996,  songwriters: "McCluskey, Nigel Ipinson, Keith Small"},
                {artist: "Dire Straits", name: "Sultans of Swing",          release_year: 1978,  songwriters: "Mark Knopfler"},
                {artist: "Queen",        name: "I Want To Break Free",      release_year: 1984,  songwriters: "John Deacon"},
            ]);
        }
    }
}

export default new DatabaseFactory();
