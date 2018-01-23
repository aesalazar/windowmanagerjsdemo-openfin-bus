const sinon = require('sinon');
const bus = require('./openFinBus');

//Setup finTopic
const topic = "windowmanagerjsdemo-openfin-topic1";
const uuid = "windowmanagerjsdemo-openfin-bus-javascript";
const javaUuid = "windowmanagerjsdemo-openfin-bus-java";
const dotnetUuid = "windowmanagerjsdemo-openfin-bus-wpf";

const mockFinTopic = {
    topic,
    uuid,
    javaUuid,
    dotnetUuid
};

//Setup fin system
const mockAddEventListener = sinon.spy();

const mockFinSystem = {
    addEventListener: mockAddEventListener
};

//Setup fin bus
const mockAddSubscribeListener = sinon.spy();
const mockRemoveSubscribeListener = sinon.spy();

const mockAddUnsubscribeListener = sinon.spy();
const mockRemoveUnsubscribeListener = sinon.spy();

const mockSubscribe = sinon.spy();
const mockUnsubscribe = sinon.spy();

const mockPublish = sinon.spy();
const mockSend = sinon.spy();

const mockFinBus = {
    addSubscribeListener: mockAddSubscribeListener,
    removeSubscribeListener: mockRemoveSubscribeListener,

    addUnsubscribeListener: mockAddUnsubscribeListener,
    removeUnsubscribeListener: mockRemoveUnsubscribeListener,

    subscribe: mockSubscribe,
    unsubscribe: mockUnsubscribe,

    publish: mockPublish,
    send: mockSend
};

//Do the injection
bus.initialize(mockFinTopic, mockFinBus, mockFinSystem);

/** 
 * Mock version of openFinBus.js.
 */
module.exports = {
    /** openFinBus object. */
    bus,

    /** Mock finTopic object in openFinBus.~ */
    mockFinTopic,

    /** Mock finBus object injected in openFinBus. */
    mockFinBus,
    
    /** Mock finSystem object injected in openFinBus. */
    mockFinSystem
};