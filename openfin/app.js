//---------  WEB SERVER ---------//
const http = require('http');
const express = require('express');
const openFinJson = require('./public/openFinJson');

const webPort = 5000;

//Create and start the web server
const app = express();
const server = http.createServer(app);

//Expose the public folder
app.use(express.static('./public'));

//Generate app.json dynamically based on calling ip
app.get('/app.json', function (req, res, next) {
    //Set the json to reference ipaddress and send it back
    let json = openFinJson(req.headers.host);
    res.setHeader('Content-type', 'application/json');
    res.send(json);
});

//Start the server
server.listen(process.env.PORT || webPort, () => {
    console.log('Listening on%j\n', server.address());
});