// api para los sectors

var express = require('express');
var router = express.Router();

var seguridad = require('./seguridad');

var DBSector = require('../datos/DBSector');
var dbSector = new DBSector();

// consulta los sectores que se pueden asociar a una ocupación
router
  .route('/sectores')
  .get(function (req, res) {
    dbSector.consultarSectores(res);
});

// registra la información básica de un sector
router
  .route('/sectores')
  .post(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    dbSector.crearSector(req, res);
});

module.exports = router;