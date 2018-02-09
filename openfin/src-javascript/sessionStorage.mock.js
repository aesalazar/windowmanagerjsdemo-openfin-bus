const sinon = require('sinon');

const mockSessionStorage = {
    getItem: sinon.stub(),
    setItem: sinon.stub(),
};

module.exports = mockSessionStorage;