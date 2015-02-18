var passport = require('passport');

var AuthController = function(eventEmitter){

    function authorizationFailed(req, res) {
        res.redirect('/login');
    }

    function showLoginPage(req, res) {
        res.render('login.html');
    }

    function login(req, res) {
        var login = req.body.login,
            password = req.body.password;

    }

    function registration(req, res) {
        var login = req.body.login,
            password = req.body.password;
    }

    return {
        authorizationFailed: authorizationFailed,
        showLoginPage: showLoginPage,
        login: login,
        registration: registration
    }
};

module.exports = AuthController;