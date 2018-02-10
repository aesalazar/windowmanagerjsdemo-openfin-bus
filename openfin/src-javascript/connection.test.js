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
            mockWebSocket.send.resetHistory();
            mockWebSocket.readyState = ws.CLOSED;

            connection
                .disconnectPromise()
                .catch(() => {
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
});