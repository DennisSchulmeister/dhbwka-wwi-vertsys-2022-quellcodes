"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Songs. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Songs werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class SongService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._songs = DatabaseFactory.database.collection("songs");
    }

    /**
     * Songs suchen. Über den Query-Parameter `search` können alle Felder der
     * Songs mit einem RegEx durchsucht werden. Alternativ können einzelne Felder
     * mitgegeben werden, die auf exakte Übereinstimmung geprüft werden.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async search(query) {
        let queryDoc = {};

        if (query.search) {
            queryDoc = {
                $or: [
                    {artist:       {$regex: query.search, $options: "i"}},
                    {name:         {$regex: query.search, $options: "i"}},
                    {release_year: {$regex: query.search, $options: "i"}},
                    {songwriters:  {$regex: query.search, $options: "i"}},
                ]
            };
        } else {
            if (query.artist)       queryDoc.artist       = query.artist;
            if (query.name)         queryDoc.name         = query.name;
            if (query.release_year) queryDoc.release_year = parseInt(query.release_year);
            if (query.songwriters)  queryDoc.songwriters  = query.songwriters;
        }

        let cursor = this._songs.find(queryDoc, {
            sort: {
                name: 1,
                artist: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einen neuen Songs.
     *
     * @param {Object} song Zu speichernder Song
     * @return {Promise} Gespeichertes Song
     */
    async create(song) {
        song = song || {};

        let newSong = {
            artist:       song.artist      || "",
            name:         song.name        || "",
            release_year: song.release_year || -1,
            songwriters:  song.songwriters || "",
        };

        let result = await this._songs.insertOne(newSong);
        return await this._songs.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Songs anhand seiner ID.
     *
     * @param {String} id ID des gesuchten Songs
     * @return {Promise} Gefundener Song
     */
    async read(id) {
        let result = await this._songs.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Songs, durch Überschreiben einzelner Felder
     * oder des gesamten Songobjekts (ohne die ID).
     *
     * @param {String} id ID des gesuchten Songs
     * @param {[type]} song Zu speichernde Songdaten
     * @return {Promise} Gespeicherte Songdaten oder undefined
     */
    async update(id, song) {
        let oldSong = await this._songs.findOne({_id: new ObjectId(id)});
        if (!oldSong) return;

        let updateDoc = {
            $set: {},
        }

        if (song.artist)       updateDoc.$set.artist       = song.aritst;
        if (song.name)         updateDoc.$set.name         = song.name;
        if (song.release_year) updateDoc.$set.release_year = song.release_year;
        if (song.songwriters)  updateDoc.$set.songwriters  = song.songwriters;

        await this._songs.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._songs.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines Songs anhand seiner ID.
     *
     * @param {String} id ID der gesuchten Songs
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._songs.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
