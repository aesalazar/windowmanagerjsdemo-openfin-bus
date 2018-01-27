const assert = require('chai').assert;
const sinon = require('sinon');
const orderMessages = require('./orderMessages');

describe('message Metadata', () => {
    it('field names count is correct', () => {
        assert.equal(orderMessages.fieldsNames.length, 28);
    });

    it('field types count is correct', () => {
        assert.equal(Object.keys(orderMessages.fieldTypes).length, 28);
    });

    it('index count is correct', () => {
        assert.equal(orderMessages.indexFields.length, 9);
    });
});

describe('message data', () => {
    it('message count is correct', ()=> {
        assert.equal(orderMessages.messages.length, 100000);
    });

    it('first row is not the header', () => {
        assert.isFalse(orderMessages.messages[0].includes('string'));
    });
});