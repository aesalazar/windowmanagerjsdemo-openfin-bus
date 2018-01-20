const packageJson = require("../package.json");

/**
 * Generates and OpenFin formatted JSON object.
 * 
 * @param {string} host Endpoint address to use as part of the http urls (e.g. "192.161.1.1").
 * @param {string} htmlFile HTML file name to add to the URL in startup_app (e.g. "index.html").
 * @returns A well-formed JSON object that the OpenFin runtime can use to launch with.
 */
function createJson(host, htmlFile) {
    const json = {
        "devtools_port": 9090,
        "startup_app": {
            "name": packageJson.name,
            "url": "http://" + host + "/" + htmlFile,
            "uuid": packageJson.name,
            "icon": "http://" + host + "/images/eikos-logo-multi.ico",
            "autoShow": true,
            "defaultTop": 100,
            "defaultLeft": 100,
            "defaultWidth": 600,
            "defaultHeight": 500
        },
        "runtime": {
            "arguments": "",
            "version": "stable"
        },
        "shortcut": {
            "company": packageJson.company,
            "description": packageJson.description,
            "icon": "http://" + host + "/images/eikos-logo-multi.ico",
            "name": packageJson.name
        }
    };
    return json;
}

module.exports = createJson;