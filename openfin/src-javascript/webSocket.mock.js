const sinon = require('sinon');
const ws = require('ws');

const mockWebSocket = {
    readyState: ws.OPEN,
    send: sinon.stub(),
};

module.exports = mockWebSocket;