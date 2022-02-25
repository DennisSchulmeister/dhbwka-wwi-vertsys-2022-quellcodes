"use strict";

/**
 * Hilfsfunktion für asynchrone HTTP-Handler.
 * Vgl. https://stackoverflow.com/a/48109157
 *
 * @param {Function} fn Asynchrone Handler-Funktion
 * @return {[type]} Synchrone Handler-Funktion mit Callback-Mechanismus
 */
export function wrapAsyncHandler(fn) {
    return (req, res, next) => {
        return fn(req, res, next).catch((err) => {
            return next(err);
        });
    };
};
