"use strict"

//// TODO: Klasse und diese Datei durch eigene Service-Klassen ersetzen ////

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Beispiele. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Beispiele werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class ExampleService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._examples = DatabaseFactory.database.collection("example");
    }

    /**
     * Beispiele suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um den Aufwand klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Beispiele
     */
    async search(query) {
        let cursor = this._examples.find(query, {
            sort: {
                title: 1,
                author: 1,
                year: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Beispiels.
     *
     * @param {Object} example Zu speichernde Beispieldaten
     * @return {Promise} Gespeicherte Beispieldaten
     */
    async create(example) {
        example = example || {};

        let newExample = {
            title:     example.title     || "",
            author:    example.author    || "",
            publisher: example.publisher || "",
            year:      example.year      || 0,
        };

        let result = await this._examples.insertOne(newExample);
        return await this._examples.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Beispiels anhand seiner ID.
     *
     * @param {String} id ID des gesuchten Beispiels
     * @return {Promise} Gefundene Beispieldaten
     */
    async read(id) {
        let result = await this._examples.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Beispiels, durch Überschreiben einzelner Felder
     * oder des gesamten Beispielobjekts (ohne die ID).
     *
     * @param {String} id ID des gesuchten Beispiels
     * @param {[type]} example Zu speichernde Beispieldaten
     * @return {Promise} Gespeicherte Beispieldaten oder undefined
     */
    async update(id, example) {
        let oldExample = await this._examples.findOne({_id: new ObjectId(id)});
        if (!oldExample) return;

        let updateDoc = {
            $set: {},
        }

        if (example.title)     updateDoc.$set.title     = example.title;
        if (example.author)    updateDoc.$set.author    = example.author;
        if (example.publisher) updateDoc.$set.publisher = example.publisher;
        if (example.year)      updateDoc.$set.year      = example.year;

        await this._examples.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._examples.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines Beispiels anhand seiner ID.
     *
     * @param {String} id ID des gesuchten Beispiels
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._examples.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
