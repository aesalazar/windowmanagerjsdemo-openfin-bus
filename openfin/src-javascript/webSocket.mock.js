const sinon = require('sinon');
const ws = require('ws');

const mockWebSocket = {
    readyState: ws.OPEN,
    send: sinon.stub(),
    OPEN: ws.OPEN,
    CLOSED: ws.CLOSED,
    OPENING: ws.OPENING,
    CLOSING: ws.CLOSING
};

module.exports = mockWebSocket;