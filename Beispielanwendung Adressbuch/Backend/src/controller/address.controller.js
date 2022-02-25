"use strict"

import AddressService from "../service/address.service.js";
import {wrapAsyncHandler} from "../utils.js";

/**
 * HTTP-Controller-Klasse für Adressbucheinträge. Diese Klasse registriert
 * alle notwendigen URL-Handler beim Webserver für einen einfachen REST-
 * Webservice zum Lesen und Schreiben von Adressen.
 */
export default class AddressController {
    /**
     * Konstruktor. Hier werden die URL-Handler registrert.
     * @param {Object} server Restify Serverinstanz
     */
    constructor(server) {
        this._addressService = new AddressService();

        // Collection: Adressen
        server.get("/address", wrapAsyncHandler(this.searchAddresses.bind(this)));
        server.post("/address", wrapAsyncHandler(this.createAddress.bind(this)));
        server.opts("/address", this.corsPreflight);

        // Entity: Adresse
        server.get("/address/:id", wrapAsyncHandler(this.readAddress.bind(this)));
        server.put("/address/:id", wrapAsyncHandler(this.updateAddress.bind(this)));
        server.patch("/address/:id", wrapAsyncHandler(this.updateAddress.bind(this)));
        server.del("/address/:id", wrapAsyncHandler(this.deleteAddress.bind(this)));
        server.opts("/address/:id", this.corsPreflight);
    }

    /**
     * GET /address: Adressen suchen
     */
    async searchAddresses(req, res, next) {
        let result = await this._addressService.searchAddresses(req.query);
        res.send(result);
        return next();
    }

    /**
     * POST /address: Neue Adresse anlegen
     */
    async createAddress(req, res, next) {
        let result = await this._addressService.createAddress(req.body);
        res.send(result);
        return next();
    }

    /**
     * GET /address/{id}: Adresse auslesen
     */
    async readAddress(req, res, next) {
        let result = await this._addressService.readAddress(req.params.id);
        res.send(result);
        return next();
    }

    /**
     * PUT oder PATCH /address/{id}: Adresse ändern
     */
    async updateAddress(req, res, next) {
        let result = await this._addressService.updateAddress(req.params.id, req.body);
        res.send(result);
        return next();
    }

    /**
     * DELETE /address/{id}: Adresse löschen
     */
    async deleteAddress(req, res, next) {
        await this._addressService.deleteAddress(req.params.id)
        res.send(204);
        return next();
    }

    /**
     * CORS Preflight durchlassen.
     */
    corsPreflight(req, res, next) {
        res.send(200);
        return next();
    }
}
