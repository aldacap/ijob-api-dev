/**
 *  api para los usuarios
 */

var express = require('express');
var router = express.Router();

var DBUsuario = require('../datos/dbUsuario');
var dbUsuario = new DBUsuario();

/**
 *  autentica un usuario mediante correo y clave
 */
router
  .route('/autenticar/:correo/:clave')
  .get(function (req, res) {
    dbUsuario.autenticarUsuario(req.params.correo, req.params.clave, res);
});

/**
 *  registra la información básica de un usuario
 */
router
  .route('/usuarios/registrar')
  .post(function (req, res) {
    dbUsuario.registrarUsuario(req, res);
});

// actualizar ocupacion principal
router
  .route('/usuarios/principal/:id')
  .put(function (req, res) {
    dbUsuario.actualizarOcupacion(true, req.params.id , req.body, res);
});

// actualizar ocupacion principal
router
  .route('/usuarios/secundaria/:id')
  .put(function (req, res) {
    dbUsuario.actualizarOcupacion(false, req.params.id , req.body, res);
});

module.exports = router;