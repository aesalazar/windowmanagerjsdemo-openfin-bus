const assert = require('chai').assert;
const mockResponse = require('./response.mock');
const api = require('./api');

describe('***** api.js *****', () => {

    describe('initialize', () => {

        it('api initializes', () => {
            assert.doesNotThrow(() => api.initialize({
                name: 'testName',
                company: 'testCompany',
                description: 'testDescription'
            }));
        });

        it('api throws error with strings', () => {
            assert.throws(() => api.initialize(
                'testName',
                'testCompany',
                'testDescription'
            ));
        });
        it('api throws error with nulls', () => {
            assert.throws(api.initialize);
        });
    });

    describe('openFinJson has strings', () => {
        const name = 'testName';
        const company = 'testCompany';
        const description = 'testDescription';
        const host = "testHost";
        const htmlFile = "testHtmlFile.html";

        const config = { name, company, description };

        let api;
        let openFinJson;

        beforeEach(() => {
            api = require('./api');
            api.initialize(config);
            openFinJson = api.createJson(host, htmlFile);
        });

        it('openFin Json contains name', () => {
            assert.equal(openFinJson.shortcut.name, name);
        });

        it('openFin Json contains company', () => {
            assert.equal(openFinJson.shortcut.company, company);
        });

        it('openFin Json contains description', () => {
            assert.equal(openFinJson.shortcut.description, description);
        });

        it('openFin Json contains host', () => {
            assert.isTrue(openFinJson.startup_app.url.includes(host));
        });

        it('openFin Json contains html file name', () => {
            assert.isTrue(openFinJson.startup_app.url.includes(htmlFile));
        });
    });

    describe('isVirtualized', () => {
        let api = require('./api');
        beforeEach(() => api = require('./api'));

        it('api defaults to false when isVirtualized is not set', () => {
            assert.doesNotThrow(() => api.initialize({
                name: 'testName',
                company: 'testCompany',
                description: 'testDescription'
            }));

            assert.isFalse(api.isVirtualized);
        });

        it('api isVirtualized is set to true', () => {
            assert.doesNotThrow(() => api.initialize({
                name: 'testName',
                company: 'testCompany',
                description: 'testDescription',
                isVirtualized: true
            }));

            assert.isTrue(api.isVirtualized);
        });

        it('api isVirtualized is set to false', () => {
            assert.doesNotThrow(() => api.initialize({
                name: 'testName',
                company: 'testCompany',
                description: 'testDescription',
                isVirtualized: false
            }));

            assert.isFalse(api.isVirtualized);
        });
    });

    describe('streamRate', () => {
        let api = require('./api');
        beforeEach(() => api = require('./api'));

        it('streamRate is not 0 by default', () => {
            assert.doesNotThrow(() => api.initialize({
                name: 'testName',
                company: 'testCompany',
                description: 'testDescription'
            }));

            assert.isAbove(api.streamRate, 0);
        });

        it('streamRate is initialized', () => {
            assert.doesNotThrow(() => api.initialize({
                name: 'testName',
                company: 'testCompany',
                description: 'testDescription',
                streamRate: 999
            }));

            assert.equal(999, api.streamRate);
        });

        it('streamRate can be updated', () => {
            assert.doesNotThrow(() => api.initialize({
                name: 'testName',
                company: 'testCompany',
                description: 'testDescription',
                streamRate: 999
            }));

            assert.equal(999, api.streamRate);

            api.streamRate = 1000;
            assert.equal(1000, api.streamRate);
        });
    });

    describe('get data functions - return counts', () => {
        const orderMessages = require('./orderMessages');

        const name = 'testName';
        const company = 'testCompany';
        const description = 'testDescription';
        const config = { name, company, description };

        beforeEach(() => {
            api.initialize(config);
        });

        it('getFieldNames has correct count', () => {
            assert.equal(api.getFieldNames().length, orderMessages.fieldNames.length);
        });

        it('getFieldTypes has correct count', () => {
            assert.equal(api.getFieldTypes().length, orderMessages.fieldTypes.length);
        });

        it('getIndexFields has correct count', () => {
            assert.equal(api.getIndexFields().length, orderMessages.indexFields.length);
        });

        it('getOrders has correct count', () => {
            assert.equal(api.getOrders().length, orderMessages.orders.length);
        });

        it('getMessages has correct count', () => {
            assert.equal(api.getMessages().length, orderMessages.messages.length);
        });
    });    

    describe('get data functions - calls response', () => {
        const name = 'testName';
        const company = 'testCompany';
        const description = 'testDescription';
        const config = { name, company, description };

        beforeEach(() => {
            api.initialize(config);
            mockResponse.send.resetHistory();
        });

        it('getFieldNames calls response.send', () => {
            api.getFieldNames(null, mockResponse);
            assert.isTrue(mockResponse.send.calledOnce);
        });

        it('getFieldTypes calls response.send', () => {
            api.getFieldTypes(null, mockResponse);
            assert.isTrue(mockResponse.send.calledOnce);
        });

        it('getIndexFields calls response.send', () => {
            api.getIndexFields(null, mockResponse);
            assert.isTrue(mockResponse.send.calledOnce);
        });

        it('getOrders calls response.send', () => {
            api.getOrders(null, mockResponse);
            assert.isTrue(mockResponse.send.calledOnce);
        });

        it('getMessages calls response.send', () => {
            api.getMessages(null, mockResponse);
            assert.isTrue(mockResponse.send.calledOnce);
        });
    });   


    describe('data stream functions', () => {
        const name = 'testName';
        const company = 'testCompany';
        const description = 'testDescription';
        const config = { name, company, description };

        beforeEach(() => {
            api.initialize(config);
            mockResponse.send.reset();
        });

        it('closeDataStream closes openDataStream', (done) => {
            const wsObject = {};
            api.openDataStream(wsObject, mockResponse, 10);
            mockResponse.send.callsFake(data => {
                api.closeDataStream(wsObject, mockResponse);
                done();
            });
        }).timeout(3000);

        it('openDataStream calls response.send with metadata', (done) => {
            const wsObject = {};
            mockResponse.send.callsFake(data => {
                assert.isNotNull(data);
                assert.equal(api.messageTypes.METADATA, data.messageType);
                assert.isNotEmpty(data.fieldNames);
                assert.isNotNull(data.fieldTypes);
                assert.isNotEmpty(data.indexFields);
                api.closeDataStream(wsObject, mockResponse);
                done();
            });

            api.openDataStream(wsObject, mockResponse, 10);
        }).timeout(3000);

        it('openDataStream calls response.send with expected data count', (done) => {
            const wsObject = {};
            api.openDataStream(wsObject, mockResponse, 10);
            
            mockResponse.send.callsFake(data => {
                assert.isNotNull(data);
                assert.equal(api.messageTypes.DATA, data.messageType);
                assert.isNotEmpty(data.data);
                assert.equal(data.data.length, 10);
                api.closeDataStream(wsObject, mockResponse);
                done();
            });
        }).timeout(3000);
    });   
});
