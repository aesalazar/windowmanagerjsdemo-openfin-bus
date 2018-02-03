const openFinJson = require('./openFinJson');
const orderMessages = require('./orderMessages');

const channels = new Map();
let streamInterval;

/**
 * Initializes the module.
 * 
 * @param {object} config Settings for app name, company, description, and virtualization.
 */
function initialize(config) {
    if (config == null ||
        config.name == null ||
        config.company == null ||
        config.description == null
    )
        throw "missing needed config options";
    
    //Setup openfin json
    openFinJson.initialize(config.name, config.company, config.description);

    //Set virtualization
    module.exports.isVirtualized = config.isVirtualized == true;

    //set streamRate
    if (config.streamRate != null)
        module.exports.streamRate = config.streamRate;
}

/**
 * Clear any instance of the socket from the channels map.
 * 
 * @param {any} websocket connection to remove.
 */
function removeChannel(websocket) {
    if (!channels.get(websocket))
        return;

    clearInterval(channels.get(websocket));
    channels.delete(websocket);
}

/**
 * Opens the data stream after clearing an existing connection.
 * 
 * @param {any} websocket connection object to send on
 * @param {any} response response object to send the data back over
 */
function openDataStream(websocket, response) {
    //Make sure there is not already a stream open
    removeChannel(websocket);

    //Create channel
    channels.set(websocket, () => updateOrderFunction(response));

    //Start the stream if not yet
    startStreamer();
}

/**
 * Closes data stream to the web socket connection.
 * 
 * @param {any} websocket connection object to send on
 * @param {any} response response object to send the data back over
 */
function closeDataStream(websocket, response) {
    removeChannel(websocket);
}

/**
 * Main function called by channel to get data.
 */
function updateOrderFunction(response) {

    //Send it back to the client
    response.send({
        data: {}
    });
}

/**
 * Start data stream; clear the interval and restart if already there.  This will
 * loop through all channels on the stream interval and call its function set in
 * openDataStream.
 */
function startStreamer() {
    clearInterval(streamInterval);

    //restart
    streamInterval = setInterval(function () {
        //Call the function of each channel
        for (const channel of channels)
            channel[1]();
    }, module.exports.streamRate);
}

/**
 * Sends collection of order field names over the response object if not null.
 * 
 * @param {any} websocket connection object to send on
 * @param {any} response response object to send the data back over
 * @returns string collection of order object field names
 */
function getFieldNames(websocket, response){
    if (response != null)
        response.send({
            data: JSON.stringify(orderMessages.fieldsNames)
        });
    
    return orderMessages.fieldsNames;
}

/**
 * Sends collection of order field types over the response object if not null.
 * 
 * @param {any} websocket connection object to send on
 * @param {any} response response object to send the data back over
 * @returns string collection of order object field types
 */
function getFieldTypes(websocket, response) {
    if (response != null)
        response.send({
            data: JSON.stringify(orderMessages.fieldTypes)
        });

    return orderMessages.fieldTypes;
}

/**
 * Sends collection of order field names that are indexable (non-string) 
 * over the response object if not null.
 * 
 * @param {any} websocket connection object to send on
 * @param {any} response response object to send the data back over
 * @returns string collection of order object field names that are indexable (non-string)
 */
function getIndexFields(websocket, response) {
    if (response != null)
        response.send({
            data: JSON.stringify(orderMessages.indexFields)
        });

    return orderMessages.indexFields;
}

/**
 * Sends collection of order objects over the response object if not null.
 * 
 * @param {any} websocket connection object to send on
 * @param {any} response response object to send the data back over
 * @returns collection of order objects
 */
function getOrders(websocket, response) {
    if (response != null)
        response.send({
            data: JSON.stringify(orderMessages.orders)
        });

    return orderMessages.orders;
}

/**
 * Sends collection of raw order strings over the response object if not null.
 * 
 * @param {any} websocket connection object to send on
 * @param {any} response response object to send the data back over
 * @returns CSV string collection of raw Order messages
 */
function getMessages(websocket, response) {
    if (response != null)
        response.send({
            data: JSON.stringify(orderMessages.messages)
        });

    return orderMessages.messages;
}

module.exports = {
    initialize,
    
    openDataStream,

    closeDataStream,

    getFieldNames,

    getFieldTypes,

    getIndexFields,

    getOrders,

    getMessages,

    /**Indicates if the server is virtualizing row data or sending everything. */
    isVirtualized: false,

    /**Rate at which the data updates will be send to clients. */
    streamRate: 200,

    /** Generates an OpenFin formatted JSON object */
    createJson: openFinJson.createJson,
};