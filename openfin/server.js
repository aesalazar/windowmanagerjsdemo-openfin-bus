const webPort = 5000;

//---------  WEBPACK ---------//
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpack = require("webpack");
const webpackConfig = require('./webpack.javascript');
const compiler = webpack(webpackConfig);

//---------  WEB SERVER ---------//
const http = require('http');
const express = require('express');
const ws = require('ws');

const serverConfig = require('./server.config.json');
const packageJson = require('./package.json');
const api = require('./server/api');
const Response = require('./server/response');

serverConfig.name = serverConfig.name || packageJson.name;
serverConfig.company = serverConfig.company || packageJson.company;
serverConfig.description = serverConfig.description || packageJson.description;

api.initialize(serverConfig);

//Create and start the web server
const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server: server });

//Expose the public and webpack folders
app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));
app.use(express.static('./public'));

//Generate app.json dynamically based on calling ip
app.get('/app-javascript.json', function (req, res, next) {
    //Set the json to reference ipaddress and send it back
    let json = api.createJson(req.headers.host, 'javascript.html');
    res.setHeader('Content-type', 'application/json');
    res.send(json);
});

//---------  WEB SOCKET LISTENERS ---------//
wss.on('connection', (ws) => {
    console.log('Connection Established:');
    //console.log(ws.upgradeReq.headers);
    console.log('\n');

    ws.on('message', (raw) => {
        let message;

        try {
            message = JSON.parse(raw);
        } catch (err) {
            return console.error("Error parsing message: %s\n", raw);
        }

        if (message && message.call) {
            console.log('received: %s\n', raw);

            if (!api[message.call])
                return;

            let args = message.args || [];
            args.unshift(new Response(ws, message));
            args.unshift(ws);
            api[message.call](...args);
        }
    });

    ws.on('close', (status, clientMsg) => {
        console.log(`Client disconnected (${status}) with message: ${clientMsg}\n`);
    });
});

//---------  START WEB SERVER ---------//
server.listen(process.env.PORT || webPort, () => {
    console.log('Listening on%j\n', server.address());
});