/**
 *  api para las calificaciones
 */

var express = require('express');
var router = express.Router();

var DBCalificacion = require('../datos/dbCalificacion');
var dbCalificacion = new DBCalificacion();

/**
 *  agrega la información de una nueva calificacion
 */
router
  .route('/calificaciones/')
  .post(function (req, res) {
    dbCalificacion.agregarCalificacion(req, res);
});
  
/**
 *  consulta la información de una calificacion
 */
router
  .route('/calificaciones/:usuario/:cantidad')
  .get(function (req, res) {
    dbCalificacion.consultarCalificacion(req.params._usuario, req.params.cantidad, res);
});

module.exports = router;