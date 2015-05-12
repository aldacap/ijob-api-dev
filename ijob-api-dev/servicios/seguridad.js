/**
 *  modulo de autenticación
 */

var passport = require('passport');
// estrategia autenticacion http-bearer
var BearerStrategy = require('passport-http-bearer').Strategy;

var DBUsuario = require('../datos/dbUsuario');
var dbUsuario = new DBUsuario();

passport
  .use(new BearerStrategy(onValidarUsuarioDB));

function onValidarUsuarioDB(token, done) {
    dbUsuario.validarUsuario(token, done);
}


module.exports = passport;