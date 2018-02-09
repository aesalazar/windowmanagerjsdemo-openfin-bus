import ws from 'ws';
let webSocket;
let storage;

/**
 * Initializes the connection.
 * @param {*} webSocketConnection Connection object to send data over.
 * @param {*} sessionStorage Storage for session state.
 */
function initialize(webSocketConnection, sessionStorage) {
    webSocket = webSocketConnection;
    storage = sessionStorage;
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
        
        if (webSocket.readyState != ws.OPEN) {
            reject(`cannot connect to websocket with state '${webSocket.readyState}'`);
            return;
        }

        webSocket.onopen = function (ev) {
            logText("webSocket connection established: " + (webSocket.readyState === ws.OPEN));
        };

        webSocket.onerror = function (ev) {
            logText("webSocket Error when connecting: " + ev);
            reject(ev);
        };

        webSocket.onclose = function (ev) {
            if (ev.code !== 1000) {
                logText("webSocket connection closed, retrying...");
                setTimeout(attemptReconnect, 1000);
            }
        };

        //Listen for responses from the server
        webSocket.onmessage = function (ev) {
            //Process data message
            const data = JSON.parse(ev.data).args[0];
            const dataObjects = data.data;

            // for (let i = 0; i < dataObjects.length; i++) {
            //     const obj = dataObjects[i];
            //     const div = document.createElement("div");
            //     const fields = Object.keys(obj);

            //     //Create a div for the each field and its value
            //     for (let j = 0; j < fields.length; j++) {
            //         const field = fields[j];

            //         var span = document.createElement("span");
            //         span.innerText = field + ": ";
            //         div.appendChild(span);

            //         var input = document.createElement("input");
            //         input.type = "text";
            //         input.value = obj[field];
            //         input.style.width = "100px";
            //         div.appendChild(input);
            //     }

            //     //Append object div to main
            //     divOutputArea.appendChild(div);
            // }

            //Update the log
            var txt = " Server ms: " + (data.serverEndTime - data.serverStartTime).toFixed(2);
            txt += " Client ms: " + (performance.now() - responseStartTime).toFixed(2);
            logText(txt);
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
        if (webSocket == null || webSocket.readyState === WebSocket.CLOSED) {
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
        
    webSocket.send(JSON.stringify({ call: "openDataStream", args: [100] }));
    storage.setItem("streamOpen", "true");
}

/**
 * Message text logging.
 * 
 * @param {any} text Log message.
 */
function logText(text) {
    console.log(text);
}

export default {
    initialize,
    connectPromise,
    disconnectPromise,
};