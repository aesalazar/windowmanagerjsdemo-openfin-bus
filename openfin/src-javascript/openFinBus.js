/******  INJECTION *****/
/** OpenFin Inter-app message bus, typically: fin.desktop.InterApplicationBus */
let finBus;

/** OpenFin container System, typically: fin.desktop.System */
let finSystem; 

/** Main Topic to message on. */
let topic;

/** Applications UUID. */
let uuid;

/** Java Application UUID. */
let javaUuid;

/** .NET Application UUID. */
let dotnetUuid;

//Messaging
const messageCallbacks = [];

//Enumerator of target platforms to send to.
const PLATFORM = Object.freeze({ JAVA: Symbol("JAVA"), DOTNET: Symbol("DOTNET") });

/****** SENDING MESSAGES ******/

/**
 * Broadcasts a message over the OpenFin inter-app bus.
 * 
 * @param { message: text } msg - message object.
 */
function publishMessage(msg) {
    if (msg == null || msg.text == null)
        return;
    
    finBus.publish(
        topic,
        msg.text,
        function () { logMessage({ text: $`Published messaged: ${text}` }); },
        function (e) { logMessage({ text: $`ERROR publishing message '${text}': ${e}` }); }
    );
}

/**
 * Sends a message over the inter-app bus.
 * 
 * @param { message: text } msg - message object.
 * @param {any} platform - PLATFORM enum to send to.
 */
function sendMessage(msg, platform) {
    if (msg == null || msg.text == null || platform == null)
        return;

    const uuid = platform === PLATFORM.JAVA ? javaUuid : dotnetUuid;
    
    finBus.send(
        uuid,
        topic,
        msg.text,
        function () { logMessage({ text: $`Sent messaged: ${text}` }); },
        function (e) { logMessage({ text: $`ERROR sending message '${text}': ${e}` }); }
    );
}


/****** EVENTS ******/

/**
 * Fires 'logMessage' event.
 * 
 * @param { message: text } msg - message object.
 */
function logMessage(msg) {
    messageCallbacks.forEach(cb => cb(msg));
}

/**
 * Add a callback listener when message are received over the OpenFin bus.
 * 
 * @param {any} callback - function to call.
 * @returns - count of the new current number of callbacks.
 */
function addMessageCallback(callback) {
    messageCallbacks.push(callback);
    return messageCallbacks.length;
}

/**
 * remove a callback listener when message are received over the OpenFin bus.
 * 
 * @param {any} callback - function to call.
 * @returns - count of the remaining number of callbacks.
 */
function removeMessageCallback (callback) {
    var index = messageCallbacks.indexOf(callback);

    if (index > -1) {
        messageCallbacks.splice(index, 1);
    }

    return messageCallbacks.length;
}


/****** LISTENERS ******/

/**
 * Subscribes to messages from OpenFin inter-app bus indicating a 
 * new listener has come subscribed to a topic.
 * 
 * @param {any} uuid - listening applications unique identifer.
 * @param {any} topic - topic the application is subscribing to.
 * @param {any} name - (optional) specific name of the application window listening. 
 */
function subscribeListener(uuid, topic, name) {
    logMessage({ text: "SUBSCRIBER: App '" + uuid + "' from " + topic });
}

/**
 * Subscribes to messages from OpenFin inter-app bus indicating a
 * new listener has come unsubscribed to a topic.
 * 
 * @param {any} uuid - listening applications unique identifer.
 * @param {any} topic - topic the application is subscribing to.
 * @param {any} name - (optional) specific name of the application window listening. 
 */
function unsubscribeListener(uuid, topic, name) {
    logMessage({ text: "UNSUBSCRIBER: App '" + uuid + "' from " + topic });
}

/**
 * Callback for OpenFin messages sent for the 'topic' subscription.
* 
 * @param {any} uuid - listening applications unique identifer.
 * @param {any} name - (optional) specific name of the application window listening. 
 */
function messageListener(message, uuid, name) {
    logMessage({ text: "RECEIVED: App '" + uuid + "' sent message: " + message });
}


/****** SETUP ******/

/**
 * Setups the connections to the openfin bus and system.
 * 
 * @param {any} openFinBus - message bus, typically: fin.desktop.InterApplicationBus
 * @param {any} openFinSystem - container System, typically: fin.desktop.System
 */
function initialize(finTopic, openFinBus, openFinSystem) {
    finBus = openFinBus;
    finSystem = openFinSystem;
    topic = finTopic.topic;
    uuid = finTopic.uuid;
    javaUuid = finTopic.javaUuid;
    dotnetUuid = finTopic.dotnetUuid;

    //Wire the listeners
    finBus.addSubscribeListener(subscribeListener);
    finBus.addUnsubscribeListener(unsubscribeListener);
    finBus.subscribe("*", topic, messageListener);

    //Listen for application shutdown to cleanup app.
    finSystem.addEventListener('application-closed', function (e) {
        finBus.removeSubscribeListener(subscribeListener);
        finBus.removeUnsubscribeListener(unsubscribeListener);
        finBus.unsubscribe("*", topic, messageListener);
    });
}

/**
 * Provides message to and from the OpenFin Inter-Application message bus.
 */
module.exports = {
    PLATFORM,
    initialize,

    publishMessage,
    sendMessage,

    logMessage,
    addMessageCallback,
    removeMessageCallback
};