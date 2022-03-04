"use strict"

//// TODO: Klasse und diese Datei durch eigene Service-Klassen ersetzen ////

import ExampleService from "../service/example.service.js";
import {wrapHandler} from "../utils.js";
import RestifyError from "restify-errors";

/**
 * HTTP-Controller-Klasse für Beispieleinräge. Diese Klasse registriert
 * alle notwendigen URL-Handler beim Webserver für einen einfachen REST-
 * Webservice zum Lesen und Schreiben von Beispielen.
 */
export default class ExampleController {
    /**
     * Konstruktor. Hier werden die URL-Handler registrert.
     *
     * @param {Object} server Restify Serverinstanz
     * @param {String} prefix Gemeinsamer Prefix aller URLs
     */
    constructor(server, prefix) {
        this._service = new ExampleService();
        this._prefix = prefix;

        // Collection: Beispielen
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Entity: Adresse
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
        server.patch(prefix + "/:id", wrapHandler(this, this.update));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }

    /**
     * GET /example
     * Beispiele suchen
     */
    async search(req, res, next) {
        let result = await this._service.search(req.query);
        res.sendResult(result);
        return next();
    }

    /**
     * POST /example
     * Neues Beispiel anlegen
     */
    async create(req, res, next) {
        let result = await this._service.create(req.body);

        res.status(201);
        res.header("Location", `${this._prefix}/${result._id}`);
        res.sendResult(result);

        return next();
    }

    /**
     * GET /example/:id
     * showException: Beispiel auslesen
     */
    async read(req, res, next) {
        let result = await this._service.read(req.params.id);

        if (result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Beispiel nicht gefunden");
        }

        return next();
    }

    /**
     * PUT /example/:id
     * PATCH /example/:id
     * showException: Beispiel ändern
     */
    async update(req, res, next) {
        let result = await this._service.update(req.params.id, req.body);

        if (result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Beispiel nicht gefunden");
        }

        return next();
    }

    /**
     * DELETE /example/:id
     * showException: Beispiel löschen
     */
    async delete(req, res, next) {
        await this._service.delete(req.params.id)
        res.status(204);
        res.sendResult({});
        return next();
    }
}
