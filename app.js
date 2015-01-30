var http = require('http');
var express = require('express');
var io = require('socket.io')();
var path = require('path');
var app = express();
var server = app.listen(3000);
var io = require('socket.io')(server);
var Router = require('./server/routes/index');
var Communicator = require('./server/communication/communicator');
var clientLocation = path.join(__dirname, '/public');

//config
app.set('views', clientLocation);
app.use(express.static(clientLocation));
app.engine('html', require('ejs').renderFile);

//custom logic
new Router(app);

new Communicator(io);

/* exports */
module.exports = app;