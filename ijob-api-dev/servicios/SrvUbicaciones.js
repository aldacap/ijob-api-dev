// api para los Ubicacions

var express = require('express');
var router = express.Router();

var seguridad = require('./seguridad');

var DBUbicacion = require('../datos/DBUbicacion');
var dbUbicacion = new DBUbicacion();

// lista de las ubicaciones Pais, Municipio, Departamento
router
  .route('/Ubicaciones')
  .get(function (req, res) {
    dbUbicacion.consultarUbicaciones(res);
});

// registra la información básica de una Ubicacion
router
  .route('/Ubicaciones')
  .post(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    dbUbicacion.crearUbicacion(req, res);
});

module.exports = router;