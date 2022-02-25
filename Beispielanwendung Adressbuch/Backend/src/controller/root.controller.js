"use strict"

import { readFile } from 'fs/promises';

/**
 * Controller für die Wurzeladresse des Webservices. Ermöglicht in dieser
 * Fassung den Abruf der OpenAPI-Spezifikation unter `/?openapi`.
 */
export default class RootController {
    /**
     * Konstruktor. Hier werden die URL-Handler registrert.
     * @param {Object} server Restify Serverinstanz
     */
    constructor(server) {
        server.get("/", this.serveOpenApiSpecification);
    }

    /**
     * GET /?openapi: Abruf der OpenAPI-Spezifikation
     */
    async serveOpenApiSpecification(req, res, next) {
        if (req.query.openapi !== undefined) {
            let filecontent = await readFile("../src/api/openapi.yaml");

            res.status(200);
            res.header("content-type", "application/openapi+yaml");
            res.sendRaw(filecontent);
        } else {
            res.send();
        }

        next();
    }
}
