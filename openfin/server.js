//---------  WEBPACK ---------//
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const config = require('./webpack.javascript');
const compiler = webpack(config);

//---------  WEB SERVER ---------//
const http = require('http');
const express = require('express');
const openFinJson = require('./server/openFinJson');

const webPort = 5000;

//Create and start the web server
const app = express();
const server = http.createServer(app);

//Expose the public and webpack folders
app.use(express.static('./public'));
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.devServer.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

//Generate app.json dynamically based on calling ip
app.get('/app-javascript.json', function (req, res, next) {
    //Set the json to reference ipaddress and send it back
    let json = openFinJson(req.headers.host, 'javascript.html');
    res.setHeader('Content-type', 'application/json');
    res.send(json);
});

//Start the server
server.listen(process.env.PORT || webPort, () => {
    console.log('Listening on%j\n', server.address());
});