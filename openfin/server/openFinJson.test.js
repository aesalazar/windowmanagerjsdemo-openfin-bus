const assert = require('chai').assert;
const sinon = require('sinon');
const openFinJson = require('./openFinJson');

describe('openFin json', () => {
    it('proper JSON is returned with ip and html file name', () => {
        const ip = `"${Math.random() * 1000}${Math.random() * 1000}`;
        const html = "testHtml.html";

        const jsonObj = openFinJson(ip, html);
        assert.exists(jsonObj);
        assert.equal(jsonObj.startup_app.url, `http://${ip}/${html}`);

        const json = JSON.stringify(jsonObj);
        assert.isTrue(json.includes(html));
        assert.isTrue(json.includes(ip));
    });

    it('handles null ip', () => {
        const html = "testHtml.html";
        const jsonObj = openFinJson(null, html);
        assert.exists(jsonObj);
        assert.equal(jsonObj.startup_app.url, `http:///${html}`);

        const json = JSON.stringify(jsonObj);
        assert.isTrue(json.includes(html));
    });

    it('handles undefined ip', () => {
        const html = "testHtml.html";
        const jsonObj = openFinJson(undefined, html);
        assert.exists(jsonObj);
        assert.equal(jsonObj.startup_app.url, `http:///${html}`);

        const json = JSON.stringify(jsonObj);
        assert.isTrue(json.includes(html));
    });

    it('handles null html', () => {
        const ip = `"${Math.random() * 1000}${Math.random() * 1000}`;
        const jsonObj = openFinJson(ip, null);
        assert.exists(jsonObj);
        assert.equal(jsonObj.startup_app.url, `http://${ip}/`);

        const json = JSON.stringify(jsonObj);
        assert.isTrue(json.includes(ip));
    });

    it('handles undefined html', () => {
        const ip = `"${Math.random() * 1000}${Math.random() * 1000}`;
        const jsonObj = openFinJson(ip, undefined);
        assert.exists(jsonObj);
        assert.equal(jsonObj.startup_app.url, `http://${ip}/`);

        const json = JSON.stringify(jsonObj);
        assert.isTrue(json.includes(ip));
    });
});