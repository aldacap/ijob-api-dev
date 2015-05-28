/**
 *  api para las calificaciones
 */

var express = require('express');
var router = express.Router();

var DBCalificacion = require('../datos/dbCalificacion');
var dbCalificacion = new DBCalificacion();

/**
 *  agrega la información de una calificacion pendiente
 */
router
  .route('/calificaciones/')
  .put(function (req, res) {
    dbCalificacion.agregarCalificacion(req, res);
});
  
/**
 *  consulta la información de calificaciones recibida o otorgadas
 */
router
  .route('/calificaciones/:usuario/:cantidad/:tipo')
  .get(function (req, res) {
    dbCalificacion.consultarCalificacion(req.params.usuario, req.params.cantidad, req.params.tipo, res);
});

/**
 *  consulta la información de calificaciones pendientes
 */
router
  .route('/calificaciones/pendientes/:usuario')
  .get(function (req, res) {
    dbCalificacion.buscarCalificacion(req.params.usuario, res);
});

module.exports = router;