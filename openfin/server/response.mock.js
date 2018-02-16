const sinon = require('sinon');

const mockSocket = {
    send: sinon.spy(),
};

const mockRequest = {
    id: sinon.spy(),    
};

const mockResponse = {
    send: sinon.stub(),
    socket: mockSocket,
    request: mockRequest,
};

module.exports = mockResponse;