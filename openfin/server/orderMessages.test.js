const assert = require('chai').assert;
const orderMessages = require('./orderMessages');

describe('***** orderMessages.js *****', () => {
    describe('order data', () => {
        it('field names count is correct', () => {
            assert.equal(orderMessages.fieldsNames.length, 28);
        });

        it('field types count is correct', () => {
            assert.equal(Object.keys(orderMessages.fieldTypes).length, 28);
        });

        it('index count is correct', () => {
            assert.equal(orderMessages.indexFields.length, 9);
        });

        it('order count is correct', () => {
            assert.equal(orderMessages.orders.length, 100000);
        });
    });

    describe('raw message data', () => {
        it('message count is correct', () => {
            assert.equal(orderMessages.messages.length, 100000);
        });

        it('first row is not the header', () => {
            assert.isFalse(orderMessages.messages[0].includes('string'));
        });
    });
});
