// api para los Ubicacions

var express = require('express');
var router = express.Router();

var DBUbicacion = require('../datos/DBUbicacion');
var dbUbicacion = new DBUbicacion();

router
  .route('/Ubicaciones')
  .get(function (req, res) {
    dbUbicacion.consultarUbicaciones(res);
});

// registra la información básica de una Ubicacion
router
  .route('/Ubicaciones')
  .post(function (req, res) {
    dbUbicacion.crearUbicacion(req, res);
});

module.exports = router;