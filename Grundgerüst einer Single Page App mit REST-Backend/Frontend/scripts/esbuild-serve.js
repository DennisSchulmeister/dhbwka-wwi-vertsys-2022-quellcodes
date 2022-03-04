"use strict";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { serve } from "esbuild";
import { lessLoader } from "esbuild-plugin-less";
import path from "path";

serve({
    servedir: path.join(__dirname, "..", "static"),
    port: 8080,
}, {
    entryPoints: [path.join(__dirname, "..", "src", "app.js")],
    bundle: true,
    splitting: true,
    format: "esm",
    outdir: path.join(__dirname, "..", "static"),
    sourcemap: true,
    plugins: [lessLoader()],
    loader: {
        ".htm": "text",
        ".html": "text",
        ".svg": "text",
        ".ttf": "dataurl",
        ".woff": "dataurl",
        ".woff2": "dataurl",
        ".eot": "dataurl",
        ".jpg": "dataurl",
        ".png": "dataurl",
        ".gif": "dataurl",
    },
}).then(() => {
    console.log("Listening on port 8080");
});
