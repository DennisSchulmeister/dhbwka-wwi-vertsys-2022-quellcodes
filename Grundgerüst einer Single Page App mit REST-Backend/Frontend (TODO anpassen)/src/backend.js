"use strict";

/**
 * Einheitliche Klasse zur Kapselung aller Backendzugriffe. Diese Klasse
 * stellt eine interne Schnittstelle zur Verfügung, die es einfacher macht,
 * die Funktionen des Backends aufzurufen. Insbesondere versteckt sie die
 * HTTP-Kommunikation vor ihren Verwendern.
 */
export default class Backend {
    /**
     * Konstruktor.
     */
    constructor() {
        this._url = "";
    }

    /**
     * Abruf der Backend-URL aus der Datei `api.url`. Diese kann über die
     * Umgebungsvariable API_URL beim Start des Docker-Containers überschrieben
     * werden.
     */
    async init() {
        // Backend-URL abrufen
        let response = await fetch("api.url");
        this._url = await response.text();

        // Angehnängte Slashes entfernen
        while (this._url.endsWith("/")) {
            this._url = this._url.slice(0, this._url.length - 1);
        }
    }

    /**
     * Low-level Wrapper um die Fetch API, um diese bei jeder Verwendung mit
     * denselben Parametern zu versorgen. Wird eigentlich nur innerhalb dieser
     * Klasse benötigt. Außerhalb der Klasse sollten die anderen Methoeden
     * verwendet werden, um gezielte Funktionen aufzurufen.
     *
     * @param {string} url - Aufzurufende URL (ohne den Prefix aus `this._url`)
     * @param {object} options - Konfigurationswerte (optional)
     * @returns {Promise} Ergebnis des eigentlichen fetch()-Aufrufs
     */
    async fetch(url, options) {
        options = options || {};
        let response = await fetch(`${this._url}${url}`, options);

        if (response.ok) {
            return response;
        } else {
            // Exception werfen, wenn ein Fehler empfangen wurde
            let contentType = response.headers.get("Content-Type");

            if (contentType.includes("json")) {
                throw await response.json();
            } else {
                throw {
                    code: "SERVER_ERROR",
                    message: `HTTP ${response.status} ${response.statusText}: ${await response.text()}`,
                };
            }
        }
    }

    /**
     * Adressen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async searchAddresses(query) {
        query = query || {};

        let parameters = new URLSearchParams();
        if (query.first_name) parameters.append("first_name", query.first_name);
        if (query.last_name) parameters.append("last_name", query.last_name);

        let response = await this.fetch(`/address?${parameters}`);
        return response.json();
    }

    /**
     * Speichern einer neuen Adresse.
     *
     * @param {Object} address Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten
     * @throws {RestifyError} Fehlerhafte Eingaben
     */
    async createAddress(address) {
        let response = await this.fetch("/address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(address),
        });

        return await response.json();
    }

    /**
     * Auslesen einer vorhandenen Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Gefundene Adressdaten
     */
    async readAddress(id) {
        let response = await this.fetch(`/address/${id}`);
        return response.json();
    }

    /**
     * Aktualisierung einer Adresse, durch Überschreiben einzelner Felder
     * oder des gesamten Adressobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Adresse
     * @param {[type]} address Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten
     * @throws {RestifyError} Fehlerhafte Eingaben
     */
    async updateAddress(id, address) {
        let response = await this.fetch(`/address/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(address),
        });

        return await response.json();
    }

    /**
     * Löschen einer Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async deleteAddress(id) {
        let response = await this.fetch(`/address/${id}`, {
            method: "DELETE",
        });

        return response.text();
    }
}
