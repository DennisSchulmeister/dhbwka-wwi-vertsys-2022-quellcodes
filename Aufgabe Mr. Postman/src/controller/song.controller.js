"use strict"

import SongService from "../service/song.service.js";
import {wrapHandler} from "../utils.js";
import RestifyError from "restify-errors";

/**
 * HTTP-Controller-Klasse für Songs. Diese Klasse registriert alle notwendigen
 * URL-Handler beim Webserver für einen einfachen REST-Webservice zum Lesen und
 * Schreiben von Songs.
 */
export default class SongController {
    /**
     * Konstruktor. Hier werden die URL-Handler registriert.
     *
     * @param {Object} server Restify Serverinstanz
     * @param {String} prefix Gemeinsamer Prefix aller URLs
     */
    constructor(server, prefix) {
        this._service = new SongService();
        this._prefix = prefix;

        // Collection: Adressen
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Entity: Adresse
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
        server.patch(prefix + "/:id", wrapHandler(this, this.update));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }

    /**
     * Hilfsmethode zum Einfügen von HATEOAS-Links in einen Datensatz.
     * Dem Datensatz wird ein Attribut `_links` gemäß der OpenAPI-Spezifikation
     * hinzugefügt, damit ein Client erkennen kann, wie er die Entität lesen,
     * ändern oder löschen kann.
     *
     * @param {Object} entity Zu verändernder Datensatz.
     */
    _insertHateoasLinks(entity) {
        let url = `${this._prefix}/${entity._id}`;

        entity._links = {
            read:   {url: url, method: "GET"},
            update: {url: url, method: "PUT"},
            patch:  {url: url, method: "PATCH"},
            delete: {url: url, method: "DELETE"},
        }
    }

    /**
     * GET /song
     * Songs suchen
     */
    async search(req, res, next) {
        let result = await this._service.search(req.query);
        result.forEach(entity => this._insertHateoasLinks(entity));
        res.sendResult(result);
        return next();
    }

    /**
     * POST /song
     * Neuen Song anlegen
     */
    async create(req, res, next) {
        let result = await this._service.create(req.body);
        this._insertHateoasLinks(result);

        res.status(201);
        res.header("Location", `${this._prefix}/${result._id}`);
        res.sendResult(result);

        return next();
    }

    /**
     * GET /song/:id
     * Song auslesen
     */
    async read(req, res, next) {
        let result = await this._service.read(req.params.id);
        this._insertHateoasLinks(result);

        if (result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Song nicht gefunden");
        }

        return next();
    }

    /**
     * PUT /song/:id
     * PATCH /song/:id
     * Song ändern
     */
    async update(req, res, next) {
        let result = await this._service.update(req.params.id, req.body);
        this._insertHateoasLinks(result);

        if (result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Song nicht gefunden");
        }

        return next();
    }

    /**
     * DELETE /song/:id
     * Song löschen
     */
    async delete(req, res, next) {
        await this._service.delete(req.params.id)
        res.status(204);
        res.sendResult({});
        return next();
    }
}
