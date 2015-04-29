/**
 *  api para los sectors
 */

var express = require('express');
var router = express.Router();

var DBSector = require('../datos/DBSector');
var dbSector = new DBSector();

router
  .route('/sectores')
  .get(function (req, res) {
    dbSector.consultarSectores(res);
});

/**
 *  registra la información básica de un sector
 */
router
  .route('/sectores')
  .post(function (req, res) {
    dbSector.crearSector(req, res);
});

module.exports = router;