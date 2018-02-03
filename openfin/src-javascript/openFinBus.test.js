const assert = require('chai').assert;
const sinon = require('sinon');
const mockBus = require('./openFinBus.mock');

const bus = mockBus.bus;
const mockFinBus = mockBus.mockFinBus;
const mockFinSystem = mockBus.mockFinSystem;
const mockFinTopic = mockBus.mockFinTopic;

describe('***** openFinBus.js *****', () => {
    describe('openFinBus javascript testing', () => {

        describe('supported PLATFORMS', () => {
            it('supports java', () => {
                assert.isNotNull(bus.PLATFORM.JAVA);
            });

            it('supports .net', () => {
                assert.isNotNull(bus.PLATFORM.DOTNET);
            });
        });

        describe('addMessageCallback and removeMessageCallback', () => {
            const cb = () => { };

            it('should return 1 when function is added', () => {
                assert.equal(bus.addMessageCallback(cb), 1);
            });

            it('should return 0 when function is removed', () => {
                assert.equal(bus.removeMessageCallback(cb), 0);
            });

            it('remove un-added callback should be handled', () => {
                assert.equal(bus.removeMessageCallback(() => { }), 0);
            });

            it('add can handel null', () => {
                assert.doesNotThrow(() => bus.addMessageCallback(null));
            });

            it('remove can handel null', () => {
                assert.doesNotThrow(() => bus.removeMessageCallback(null));
            });
        });

        describe('logMessage', () => {
            it('message is sent to callback', () => {
                const msg = { message: "Test Message" };
                const mockCallback = sinon.spy();
                bus.addMessageCallback(mockCallback);

                assert.isFalse(mockCallback.calledWith(msg));
                bus.logMessage(msg);
                assert.isTrue(mockCallback.calledWith(msg));

                bus.removeMessageCallback(mockCallback);
            });

            it('handles null', () => {
                const mockCallback = sinon.spy();
                bus.addMessageCallback(mockCallback);

                assert.isFalse(mockCallback.calledWith(null));
                bus.logMessage(null);
                assert.isTrue(mockCallback.calledWith(null));

                bus.removeMessageCallback(mockCallback);
            });

            it('handles no listeners', () => {
                const msg = { message: "Test Message" };
                const mockCallback = sinon.spy();

                //Send with nothing listening
                assert.equal(bus.removeMessageCallback(() => { }), 0);
                assert.doesNotThrow(() => bus.logMessage(msg));
            });
        });

        describe('publishMessage', () => {
            it('message is published', () => {
                mockFinBus.publish.resetHistory();
                const msg = { text: "Test Message" };

                assert.isTrue(mockFinBus.publish.notCalled);
                bus.publishMessage(msg);
                assert.isTrue(mockFinBus.publish.calledWith(
                    mockFinTopic.topic,
                    msg.text
                ));
            });

            it('handles missing text property', () => {
                mockFinBus.publish.resetHistory();

                bus.publishMessage({});
                assert.isTrue(mockFinBus.publish.notCalled);
            });

            it('handles null', () => {
                mockFinBus.publish.resetHistory();

                bus.publishMessage(null);
                assert.isTrue(mockFinBus.publish.notCalled);
            });
        });

        describe('sendMessage', () => {
            it('message is sent to JAVA', () => {
                const msg = { text: "Test Message" };
                mockFinBus.send.resetHistory();

                assert.isTrue(mockFinBus.send.notCalled);
                bus.sendMessage(msg, bus.PLATFORM.JAVA);

                assert.isTrue(mockFinBus.send.calledWith(
                    mockFinTopic.javaUuid,
                    mockFinTopic.topic,
                    msg.text
                ));
            });

            it('message is sent to .NET', () => {
                const msg = { text: "Test Message" };
                mockFinBus.send.resetHistory();

                assert.isTrue(mockFinBus.send.notCalled);
                bus.sendMessage(msg, bus.PLATFORM.DOTNET);

                assert.isTrue(mockFinBus.send.calledWith(
                    mockFinTopic.dotnetUuid,
                    mockFinTopic.topic,
                    msg.text
                ));
            });

            it('handles missing platform property', () => {
                mockFinBus.send.resetHistory();

                bus.sendMessage({ text: "Test Message" });
                assert.isTrue(mockFinBus.send.notCalled);
            });

            it('handles missing text property', () => {
                mockFinBus.send.resetHistory();

                bus.sendMessage({ platform: bus.PLATFORM.JAVA });
                assert.isTrue(mockFinBus.send.notCalled);
            });

            it('handles null', () => {
                mockFinBus.publish.resetHistory();

                bus.sendMessage(null);
                assert.isTrue(mockFinBus.send.notCalled);
            });
        });
    });
});
