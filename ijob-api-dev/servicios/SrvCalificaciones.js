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
 *  consulta la información de calificaciones recibida o otorgadas
 */
router
  .route('/calificaciones/:usuario/:cantidad/:tipo')
  .get(function (req, res) {
    dbCalificacion.consultarCalificacion(req.params.usuario, req.params.cantidad, req.params.tipo, res);
});

module.exports = router;