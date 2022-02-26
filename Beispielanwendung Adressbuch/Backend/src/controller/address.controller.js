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
     *
     * @param {Object} server Restify Serverinstanz
     * @param {String} prefix Gemeinsamer Prefix aller URLs
     */
    constructor(server, prefix) {
        this._addressService = new AddressService();

        // Collection: Adressen
        server.get(prefix, wrapAsyncHandler(this.searchAddresses.bind(this)));
        server.post(prefix, wrapAsyncHandler(this.createAddress.bind(this)));

        // Entity: Adresse
        server.get(prefix + "/:id", wrapAsyncHandler(this.readAddress.bind(this)));
        server.put(prefix + "/:id", wrapAsyncHandler(this.updateAddress.bind(this)));
        server.patch(prefix + "/:id", wrapAsyncHandler(this.updateAddress.bind(this)));
        server.del(prefix + "/:id", wrapAsyncHandler(this.deleteAddress.bind(this)));
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
        res.status(204);
        res.send({});
        return next();
    }
}
