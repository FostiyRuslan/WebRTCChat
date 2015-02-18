var config = require('./config');
var http = require('http');
var express = require('express');
var path = require('path');
var app = express();
var server = app.listen(config.port);
var communicatorManager = require('./server/CommunicatorManager')(server);
var communicator = require('./server/communication/communicator')(
    communicatorManager.io,
    communicatorManager.eventEmitter
);
var clientLocation = path.join(__dirname, '/public');
var dbConnection = require('./server/DbConnection');
var roleManager = require('./server/RolesManager')();
var router = require('./server/Router');
var passport = require('passport');


//config
app.configure(function () {
    app.use(express.static(clientLocation));
    app.set('views', clientLocation);
    app.engine('html', require('ejs').renderFile);
    app.use(express.cookieParser('secret'));
    app.use(express.cookieSession());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(roleManager.middleware());
    app.use(app.router);
});

dbConnection(function (err, dbConnection) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('connected to db');
    router(app, communicatorManager.eventEmitter, roleManager);
});

/* exports */
module.exports = app;