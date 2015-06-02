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
  .route('/busqueda/:ocupacion/:cantidad')
  .get(function (req, res) {
    dbBusqueda.buscarPerfiles(req.params.ocupacion, req.params.cantidad, res);
});

/**
 *  obtiene datos del resultado de busqueda avanzada
 */
router
  .route('/busqueda/avanzada/:ocupacion/:ciudad/:categoria/:calificacion/:cantidad')
  .get(function (req, res) {
    dbBusqueda.buscarAvanzada(req.params.ocupacion, req.params.ciudad, req.params.categoria, req.params.calificacion, req.params.cantidad, res);
});

module.exports = router;