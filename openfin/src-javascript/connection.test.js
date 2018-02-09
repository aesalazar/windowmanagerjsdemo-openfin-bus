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
            setTimeout(() => done("timed out"), 500);

            mockWebSocket.send.resetHistory();
            mockWebSocket.readyState = ws.CLOSED;

            connection
                .connectPromise(mockWebSocket)
                .catch(() => {
                    assert.isTrue(mockWebSocket.send.notCalled);
                    done();
                });
        });

        it('connectPromise still calls send when ws.OPEN', (done) => {
            setTimeout(() => done("timed out"), 500);
            mockWebSocket.send.resetHistory();

            connection
                .connectPromise(mockWebSocket)
                .then(() => {
                    assert.isTrue(mockWebSocket.send.calledOnce);
                    done();
                });
        });

        it('connectPromise does not call send when session open is true', (done) => {
            setTimeout(() => done("timed out"), 500);
            mockWebSocket.send.resetHistory();

            mockSessionStorage.getItem.reset();
            mockSessionStorage.getItem.returns('true');

            connection
                .connectPromise(mockWebSocket)
                .then(() => {
                    assert.isFalse(mockWebSocket.send.calledOnce);
                    done();
                });
        });
    });
});