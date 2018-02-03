const assert = require('chai').assert;

describe('***** openFinJson.js *****', () => {
    describe('initialize', () => {
        const openFinJson = require('./openFinJson');

        it('name is set', () => {
            openFinJson.initialize('testName');
            assert.equal(openFinJson.appName, 'testName');
        });

        it('company is set', () => {
            openFinJson.initialize(null, 'testCompany');
            assert.equal(openFinJson.companyName, 'testCompany');
        });

        it('description is set', () => {
            openFinJson.initialize(null, null, 'testDescription');
            assert.equal(openFinJson.shortcutDescription, 'testDescription');
        });

        it('init values are returned', () => {
            const id = `${Math.random() * 1000}`;
            const name = `name${id}`;
            const company = `company${id}`;
            const description = `description${id}`;

            const ip = `${Math.random() * 1000}${Math.random() * 1000}`;
            const html = "testHtml.html";

            openFinJson.initialize(name, company, description);
            const jsonObj = openFinJson.createJson(ip, html);
            assert.exists(jsonObj);
            assert.equal(jsonObj.startup_app.url, `http://${ip}/${html}`);
            assert.equal(jsonObj.startup_app.name, name);
            assert.equal(jsonObj.startup_app.uuid, name);

            assert.equal(jsonObj.shortcut.name, name);
            assert.equal(jsonObj.shortcut.company, company);
            assert.equal(jsonObj.shortcut.description, description);
        });
    });

    describe('openFin json', () => {
        const openFinJson = require('./openFinJson');

        it('proper JSON is returned with ip and html file name', () => {
            const ip = `"${Math.random() * 1000}${Math.random() * 1000}`;
            const html = "testHtml.html";

            const jsonObj = openFinJson.createJson(ip, html);
            assert.exists(jsonObj);
            assert.equal(jsonObj.startup_app.url, `http://${ip}/${html}`);

            const json = JSON.stringify(jsonObj);
            assert.isTrue(json.includes(html));
            assert.isTrue(json.includes(ip));
        });

        it('handles null ip', () => {
            const html = "testHtml.html";
            const jsonObj = openFinJson.createJson(null, html);
            assert.exists(jsonObj);
            assert.equal(jsonObj.startup_app.url, `http:///${html}`);

            const json = JSON.stringify(jsonObj);
            assert.isTrue(json.includes(html));
        });

        it('handles undefined ip', () => {
            const html = "testHtml.html";
            const jsonObj = openFinJson.createJson(undefined, html);
            assert.exists(jsonObj);
            assert.equal(jsonObj.startup_app.url, `http:///${html}`);

            const json = JSON.stringify(jsonObj);
            assert.isTrue(json.includes(html));
        });

        it('handles null html', () => {
            const ip = `"${Math.random() * 1000}${Math.random() * 1000}`;
            const jsonObj = openFinJson.createJson(ip, null);
            assert.exists(jsonObj);
            assert.equal(jsonObj.startup_app.url, `http://${ip}/`);

            const json = JSON.stringify(jsonObj);
            assert.isTrue(json.includes(ip));
        });

        it('handles undefined html', () => {
            const ip = `"${Math.random() * 1000}${Math.random() * 1000}`;
            const jsonObj = openFinJson.createJson(ip, undefined);
            assert.exists(jsonObj);
            assert.equal(jsonObj.startup_app.url, `http://${ip}/`);

            const json = JSON.stringify(jsonObj);
            assert.isTrue(json.includes(ip));
        });
    });
});