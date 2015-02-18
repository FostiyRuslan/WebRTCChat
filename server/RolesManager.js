var ConnectRoles = require('connect-roles');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var RolesManager = function () {
    var roleManager = new ConnectRoles({
        failureHandler: function (req, res) {
            res.redirect(401, '/login');
        }
    });

    roleManager.use('authenticated', function (req, action) {
        if (req.isAuthenticated()) {
            return true;
        }
    });

    passport.use(new LocalStrategy(
        function(login, password, done) {
            db.User.findOne({ login: login }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (!user.verifyPassword(password)) { return done(null, false); }
                return done(null, user);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        db.User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    return roleManager
};


module.exports = RolesManager;