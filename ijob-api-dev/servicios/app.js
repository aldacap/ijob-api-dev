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
var srvUsuarios = require('./SrvUsuarios');
app.use('/api', srvUsuarios);

// rutas para los sectores
var srvSectores = require('./SrvSectores');
app.use('/api', srvSectores);

//// rutas para las ocupaciones
//var srvOcupaciones = require('./SrvOcupaciones');
//app.use('/api', srvOcupaciones);

module.exports = app;