/**
 * modulo express: rutas
 */
var express = require('express');
// modulo de obtener los parametros de los request
var parser = require('body-parser');
// Crea una app express
var app = express();

var seguridad = require('./seguridad');

// manejador de carga de imagenes
var multer = require('multer');

// inicializa la autenticación
app.use(seguridad.initialize());

// acepta parámetros en json
app.use(parser.json());
// acepta parametros por url encoded
app.use(parser.urlencoded());

// middleware que procesa los archivos que se suben
app.use(multer({
    dest: './uploads/',
    onFileUploadComplete: function onImagenCargada(file) {
        done = true;
    }
}));

// rutas para las imagenes de los usuarios
var srvImagenes = require('./SrvImagenes');
app.use('/api', srvImagenes);

// rutas para los usuarios
var srvUsuarios = require('./SrvUsuarios');
app.use('/api', srvUsuarios);

// rutas para los sectores
var srvSectores = require('./SrvSectores');
app.use('/api', srvSectores);

// rutas para los ubicaciones
var srvUbicaciones = require('./SrvUbicaciones');
app.use('/api', srvUbicaciones);

// rutas para las calificaciones
var srvCalificaciones = require('./SrvCalificaciones');
app.use('/api', srvCalificaciones);

// rutas para los contactos
var srvContactos = require('./SrvContactos');
app.use('/api', srvContactos);

module.exports = app;