/**
 *  modulo de autenticación
 */

var passport = require('passport');
// estrategia autenticacion http-bearer
var BearerStrategy = require('passport-http-bearer').Strategy; 

var Usuario = require('../modelos/usuario'); // modelo de un usuario

passport.use(new BearerStrategy(
    function (token, done) {
        Usuario.findOne({ token: token }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user, { scope: 'all' });
        });
    }
));

module.exports = passport;