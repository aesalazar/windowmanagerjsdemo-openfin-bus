// import _ from 'lodash';

// document.body.appendChild(createMainElement());

// /**
//  * Creates the main element of the application.
//  */
// function createMainElement() {
//     var element = document.createElement('div');
//     element.innerHTML = _.join(['Hello', 'World'], ' ');
//     return element;
// }

const textMessage = document.getElementById("textMessage");
const logOutput = document.getElementById("logOutput");

//Constants
const topic = "windowmanagerjsdemo-openfin-topic1";
const uuid = "windowmanagerjsdemo-openfin-bus-javascript";
const javaUuid = "windowmanagerjsdemo-openfin-bus-java";
const wpfUuid = "windowmanagerjsdemo-openfin-bus-wpf";

function publishMessage(msg) {
    fin.desktop.InterApplicationBus.publish(
        topic,
        textMessage.value,
        function () { logMessage({ text: "Published..." }); },
        function (e) { logMessage({ text: "Publish error: " + e }); }
    );
}

function sendMessage(platform) {
    fin.desktop.InterApplicationBus.send(
        platform == "java" ? javaUuid : wpfUuid,
        topic,
        textMessage.value,
        function () { logMessage({ text: "Sent..." }); },
        function (e) { logMessage({ text: "Sent error: " + e }); }
    );
}

function logMessage(msg) {
    logOutput.textContent = msg.text + "\n" + logOutput.textContent;
}

//Listners
function subscribeListner(uuid, topic, name) {
    logMessage({ text: "SUBSCRIBER: App '" + uuid + "' from " + topic });
}
fin.desktop.InterApplicationBus.addSubscribeListener(subscribeListner);

function unsubscribeListner(uuid, topic, name) {
    logMessage({ text: "UNSUBSCRIBER: App '" + uuid + "' from " + topic });
}
fin.desktop.InterApplicationBus.addUnsubscribeListener(unsubscribeListner);

//Subscriptions
function messageListener(message, uuid, name) {
    logMessage({ text: "RECEIVED: App '" + uuid + "' sent message: " + message });
}
fin.desktop.InterApplicationBus.subscribe("*", topic, messageListener);

//Cleanup
fin.desktop.System.addEventListner('application-closed', function (e) {
    fin.desktop.InterApplicationBus.removeSubscribeListener(subscribeListner);
    fin.desktop.InterApplicationBus.removeUnsubscribeListener(unsubscribeListner);
    fin.desktop.InterApplicationBus.unsubscribe("*", topic, messageListener);
});