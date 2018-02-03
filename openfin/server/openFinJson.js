let name;
let company;
let description;

/**
 * Initializes the module.
 * 
 * @param {string} appName String to use for App appName, UUID, and Icon appName.
 * @param {string} companyName String to use for shortcut companyName appName.
 * @param {string} shortcutDescription String to use for shortcut shortcutDescription.
 */
function initialize(appName, companyName, shortcutDescription) {
    name = appName;
    module.exports.appName = appName;

    company = companyName;
    module.exports.companyName = companyName;
    
    description = shortcutDescription;
    module.exports.shortcutDescription = shortcutDescription;
}

/**
 * Generates an OpenFin formatted JSON object.
 * 
 * @param {string} host Endpoint address to use as part of the http urls (e.g. "192.161.1.1").
 * @param {string} htmlFile HTML file appName to add to the URL in startup_app (e.g. "index.html").
 * @returns A well-formed JSON object that the OpenFin runtime can use to launch with.
 */
function createJson(host, htmlFile) {
    host = host || "";
    htmlFile = htmlFile || "";
    
    const json = {
        "devtools_port": 9090,
        "startup_app": {
            "name": name,
            "url": `http://${host}/${htmlFile}`,
            "uuid": name,
            "icon": `http://${host}/images/eikos-logo-multi.ico`,
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
            "company": company,
            "description": description,
            "icon": `http://${host}/images/eikos-logo-multi.ico`,
            "name": name
        }
    };
    return json;
}

module.exports = {
    /**String to use for App appName, UUID, and Icon appName. */
    appName: name,

    /**String to use for shortcut companyName appName. */
    companyName: company,

    /**String to use for shortcut shortcutDescription. */
    shortcutDescription: description,

    initialize,
    createJson,
};