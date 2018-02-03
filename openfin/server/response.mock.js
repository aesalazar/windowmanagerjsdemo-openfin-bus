const sinon = require('sinon');

const mockSocket = {
    send: sinon.spy(),
};

const mockRequest = {
    id: sinon.spy(),    
};

const mockResponse = {
    send: sinon.spy(),
    socket: mockSocket,
    request: mockRequest,
};

module.exports = mockResponse;