/**
 *  api para los contactos
 */

var express = require('express');
var router = express.Router();

var DBContacto = require('../datos/dbContacto');
var dbContacto = new DBContacto();

/**
 *  agrega la información de una solicitud de contacto
 */
router
  .route('/contactos/')
  .post(function (req, res) {
    dbContacto.solicitarContacto(req, res);
});

/**
 *  respuesta de solicitud de contacto
 */
router
  .route('/contactos/')
  .put(function (req, res) {
    dbContacto.actualizarContacto(req.body.id, req.body.estado, res);
});

/**
 *  obtiene solicitudes de contacto pendientes {tipo 1:enviadas 2:recibidas}
 */
router
  .route('/contactos/pendientes/:idUsuario/:tipo')
  .get(function (req, res) {
    dbContacto.consultarSolicitudes(req.params.idUsuario, req.params.tipo, res);
});

/**
 *  obtiene solicitudes de contacto activas (sin calificacion)
 */
router
  .route('/contactos/activos/:idUsuario')
  .get(function (req, res) {
    dbContacto.buscarSolicitudes(req.params.idUsuario, res);
});

module.exports = router;