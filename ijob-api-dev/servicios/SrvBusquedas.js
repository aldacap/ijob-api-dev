/**
 *  api para las busquedas
 */

var express = require('express');
var router = express.Router();

var DBBusqueda = require('../datos/dbBusqueda');
var dbBusqueda = new DBBusqueda();

/**
 *  obtiene datos del resultado de la busqueda
 */
router
  .route('/busqueda/:ocupacion')
  .get(function (req, res) {
    dbBusqueda.buscarPerfiles(req.params.ocupacion, res);
});

module.exports = router;