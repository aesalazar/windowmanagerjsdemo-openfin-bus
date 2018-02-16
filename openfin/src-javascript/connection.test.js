const assert = require('chai').assert;
const sinon = require('sinon');
const ws = require('ws');

const mockWebSocket = require('./webSocket.mock');
const mockSessionStorage = require('./sessionStorage.mock');

describe('***** connection.js *****', () => {
    describe('connectPromise', () => {
        let connection;

        beforeEach(() => {
            connection = require('./connection').default;
            connection.initialize(mockWebSocket, mockSessionStorage);
            mockSessionStorage.getItem.returns("false");
            mockWebSocket.readyState = ws.OPEN;
        });

        it('connectPromise rejects when ws.CLOSED', (done) => {
            mockWebSocket.send.resetHistory();
            mockWebSocket.readyState = ws.CLOSED;

            connection
                .connectPromise()
                .catch(() => {
                    assert.isTrue(mockWebSocket.send.notCalled);
                    done();
                });
        }).timeout(500);

        it('connectPromise still calls send when ws.OPEN', (done) => {
            mockWebSocket.send.resetHistory();

            connection
                .connectPromise(mockWebSocket)
                .then(() => {
                    assert.isTrue(mockWebSocket.send.calledOnce);
                    done();
                });
        }).timeout(500);

        it('connectPromise does not call send when session open is true', (done) => {
            mockWebSocket.send.resetHistory();
            mockSessionStorage.getItem.reset();
            mockSessionStorage.getItem.returns('true');

            connection
                .connectPromise()
                .then(() => {
                    assert.isFalse(mockWebSocket.send.calledOnce);
                    done();
                });
        }).timeout(500);
    });

    describe('disconnectPromise', () => {
        let connection;

        beforeEach(() => {
            connection = require('./connection').default;
            connection.initialize(mockWebSocket, mockSessionStorage);
            mockSessionStorage.getItem.returns("true");
            mockWebSocket.readyState = ws.OPEN;
        });

        it('disconnectPromise rejects when ws.CLOSED', (done) => {
            mockWebSocket.send.resetHistory();
            mockWebSocket.readyState = ws.CLOSED;

            connection
                .disconnectPromise()
                .catch(() => {
                    assert.isTrue(mockWebSocket.send.notCalled);
                    done();
                });
        }).timeout(500);

        it('disconnectPromise calls setItem', (done) => {
            mockSessionStorage.setItem.resetHistory();

            connection
                .disconnectPromise()
                .then(() => {
                    assert.isTrue(mockSessionStorage.setItem.calledOnce);
                    done();
                });
        }).timeout(500);

        it('disconnectPromise does not call send when closed', (done) => {
            mockWebSocket.send.resetHistory();
            mockWebSocket.readyState = ws.CLOSED;

            connection
                .disconnectPromise()
                .catch(() => {
                    assert.isTrue(mockWebSocket.send.notCalled);
                    done();
                });
        }).timeout(500);

        it('disconnectPromise does not setItem when closed', (done) => {
            mockSessionStorage.setItem.resetHistory();
            mockWebSocket.readyState = ws.CLOSED;

            connection
                .disconnectPromise()
                .catch(() => {
                    assert.isTrue(mockSessionStorage.setItem.notCalled);
                    done();
                });
        }).timeout(500);
    });

    describe('onMetadata', () => {
        let connection;

        beforeEach((done) => {
            connection = require('./connection').default;
            connection.initialize(mockWebSocket, mockSessionStorage);
            mockSessionStorage.getItem.returns("true");
            mockWebSocket.readyState = ws.OPEN;
            connection
                .connectPromise()
                .then(done);
        });
        
        it('onMetadata is called', (done) => {
            const handler = () => {
                connection.removeMetadataHandler(handler);
                done();
            };
            connection.addMetadataHandler(handler);

            const ev = {
                data: JSON.stringify({
                    args: [{
                        "messageType": connection.messageTypes.METADATA
                    }]
                })
            };
            mockWebSocket.onmessage(ev);
        }).timeout(500);

        it('onMetadata fieldNames is passed', (done) => {
            const fieldNames = ["field1"];

            const handler = (names) => {
                connection.removeMetadataHandler(handler);
                assert.sameMembers(names, fieldNames);
                done();
            };
            connection.addMetadataHandler(handler);

            const ev = {
                data: JSON.stringify({
                    args: [{
                        "messageType": connection.messageTypes.METADATA,
                        fieldNames,
                    }]
                })
            };

            mockWebSocket.onmessage(ev);
        }).timeout(500);

        it('onMetadata fieldTypes is passed', (done) => {
            const fieldTypes = { "field1": "string"};

            const handler = (names, types) => {
                connection.removeMetadataHandler(handler);
                assert.equal(types.field1, fieldTypes.field1);
                done();
            };
            connection.addMetadataHandler(handler);

            const ev = {
                data: JSON.stringify({
                    args: [{
                        "messageType": connection.messageTypes.METADATA,
                        fieldTypes,
                    }]
                })
            };

            mockWebSocket.onmessage(ev);
        }).timeout(500);

        it('onMetadata indexFields is passed', (done) => {
            const indexFields = ["field1"];

            const handler = (names, types, indices) => {
                connection.removeMetadataHandler(handler);
                assert.sameMembers(indices, indexFields);
                done();
            };
            connection.addMetadataHandler(handler);

            const ev = {
                data: JSON.stringify({
                    args: [{
                        "messageType": connection.messageTypes.METADATA,
                        indexFields,
                    }]
                })
            };

            mockWebSocket.onmessage(ev);
        }).timeout(500);

    });
    
});