/**
 * modulo express: rutas
 */
var express = require('express');
// modulo de obtener los parametros de los request
var parser = require('body-parser');
// Crea una app express
var app = express();

var seguridad = require('./seguridad');

//var cliente = require('../datos/cliente');

// inicializa la autenticación
app.use(seguridad.initialize());

// acepta parámetros en json
app.use(parser.json());
// acepta parametros por url encoded
app.use(parser.urlencoded());

// rutas para los usuarios
var usuarios = require('./usuarios');
app.use('/api', usuarios);

module.exports = app;