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
 *  obtiene solicitudes de contacto pendientes
 */
router
  .route('/contactos/:idUsuario')
  .get(function (req, res) {
    dbContacto.consultarSolicitudes(req.params.idUsuario, res);
});

module.exports = router;