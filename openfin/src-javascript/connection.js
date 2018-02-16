import * as Enumerable from "linq-es2015";

let webSocket;
let storage;

/** Backend message type. */
const messageTypes = {
    /**Message containing field names, types, and indexing. */
    METADATA: 1,
    /**Message containing row data. */
    DATA: 2,
};

const metadataHandlers = [];
const dataHandlers = [];

/**
 * Initializes the connection.
 * @param {*} webSocketConnection Connection object to send data over.
 * @param {*} sessionStorage Storage for session state.
 */
function initialize(webSocketConnection, sessionStorage) {
    webSocket = webSocketConnection;
    storage = sessionStorage;
    storage.setItem("streamOpen", "false");
}

/**
 * Establishes a connection via WebSockets. 
 * 
 * @param {WebSocket} webSocketConnection socket connection to open and communicate over
 * @returns Promise that resolves when connection is made and rejects on any connection error
 */
function connectPromise() {
    return new Promise((resolve, reject) => {
        if (webSocket == null)
            reject("No webSocket object available.");
        
        if (webSocket.readyState !== webSocket.OPEN) {
            reject(`cannot connect to websocket with state '${webSocket.readyState}'`);
            return;
        }

        webSocket.onopen = function (ev) {
            logText("webSocket connection established: " + (webSocket.readyState === webSocket.OPEN));
        };

        webSocket.onerror = function (ev) {
            logText("webSocket Error when connecting: " + ev);
            reject(ev);
        };

        webSocket.onclose = function (ev) {
            if (ev.code !== 1000) {
                logText("webSocket connection closed...");
            }
            logError(ev);
        };

        //Listen for responses from the server
        webSocket.onmessage = function (ev) {
            //Process data message
            const data = JSON.parse(ev.data).args[0];

            //Fire associated callback
            const type = data.messageType;
            if (type === messageTypes.DATA)
                dataHandlers.forEach(h => {
                    try {
                        h(data.data);
                    } catch (error) {
                        logError(`Error running data handler ${h}: ${error}`);
                    }
                });
          
            else if (type === messageTypes.METADATA)
                metadataHandlers.forEach(h => {
                    try {
                        h(data.fieldNames, data.fieldTypes, data.indexFields);
                    } catch (error) {
                        logError(`Error running metadata handler ${h}: ${error}`);
                    }
                });
        };

        openStream();
        resolve();
    });
}

/**
 * Disconnects from WebSockets. 
 * 
 * @returns Promise that resolves when disconnected and rejects if already
 */
function disconnectPromise() {
    return new Promise((resolve, reject) => {
        if (webSocket == null || webSocket.readyState === webSocket.CLOSED) {
            reject("WebSocket is already disconnected.");
            return;
        }

        webSocket.send(JSON.stringify({ call: "closeDataStream" }));
        storage.setItem("streamOpen", "false");
        logText("webSocket disconnected.");

        resolve();
    });
}

/**
 * Open the data stream from the server.
 * 
 */
function openStream() {
    if (storage.getItem("streamOpen") == "true")
        return;
        
    webSocket.send(JSON.stringify({
        call: "openDataStream",
        args: [100]
    }));

    storage.setItem("streamOpen", "true");
}

/** 
 * Adds callback to invoke when a header message is received from the backend. Callbacks
 * will have the parameters:
 * {string array} fieldNames Message Field Names string collection.
 * {object array} fieldTypes Message Field Types mapped by Field Name object collection.
 * {string array} indexFields Indexable (non-string) fields names string collection.
 * 
 * @param {any} callback Callback to add.
 */
function addMetadataHandler(callback) {
    metadataHandlers.push(callback);
}

/** 
 * Removes callback to invoke when a header message is received from the backend.
 * 
 * @param {any} callback Callback to remove if found.
 */
function removeMetadataHandler(callback) {
    const index = metadataHandlers.indexOf(callback);
    if (index > -1) {
        metadataHandlers.splice(index, 1);
    }
}

/** 
 * Adds callback to invoke when a data message is received from the backend:
 * {object} data row data object received.
 * 
 * @param {any} callback Callback to add.
 */
function addDataHandler(callback) {
    dataHandlers.push(callback);
}


/** 
 * Removes callback to invoke when a data message is received from the backend.
 *
 * @param {any} callback Callback to remove if found.
 */
function removeDataHandler(callback) {
    const index = dataHandlers.indexOf(callback);
    if (index > -1) {
        dataHandlers.splice(index, 1);
    }
}

/**
 * Message text logging.
 * 
 * @param {any} text Log message.
 */
function logText(text) {
    console.log(text);
}

/**
 * Message error logging.
 * 
 * @param {any} text Log message.
 */
function logError(text) {
    console.error(text);
}
export default {
    initialize,
    connectPromise,
    disconnectPromise,

    messageTypes,
    addMetadataHandler,
    removeMetadataHandler,
    addDataHandler,
    removeDataHandler,
};