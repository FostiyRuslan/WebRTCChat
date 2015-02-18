var passport = require('passport');

var Router = function(app, eventEmitter, roleManager) {
    var AuthController = require('./controllers/AuthController')(eventEmitter);
    var RoomController = require('./controllers/RoomController')(eventEmitter);

    app.get('/login', AuthController.showLoginPage);
    app.post('/login', AuthController.login);
    app.post('/registration', AuthController.registration);
    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        AuthController.authorizationFailed
    );

    app.get('/room/:room',
        roleManager.can('authenticated'),
        RoomController.room
    );
};

module.exports = Router;