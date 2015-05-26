// api para los usuarios
var express = require('express');
var router = express.Router();

var seguridad = require('./seguridad');

var DBUsuario = require('../datos/dbUsuario');
var dbUsuario = new DBUsuario();

// autentica un usuario mediante correo y clave
router
  .route('/autenticar/:correo/:clave')
  .get(function (req, res) {
    dbUsuario.autenticarUsuario(req.params.correo, req.params.clave, res);
});

// envia un correo con la contraseña
router
  .route('/usuarios/recordar/:correo')
  .get(function (req, res) {
    dbUsuario.recordarClave(req.params.correo, res);
});

// registra la información básica de un usuario
router
  .route('/usuarios/registrar')
  .post(function (req, res) {
    dbUsuario.registrarUsuario(req, res);
});

// actualizar parcialmente un usuario
router
  .route('/usuarios/:id')
  .put(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    dbUsuario.actualizarUsuario(req.params.id , req.body, res);
});

// actualizar ocupacion principal
router
  .route('/usuarios/principal/:id')
  .put(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    dbUsuario.actualizarOcupacion(true, req.params.id , req.body, res);
});

// actualizar ocupacion principal
router
  .route('/usuarios/secundaria/:id')
  .put(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    dbUsuario.actualizarOcupacion(false, req.params.id , req.body, res);
});

// formulario para cargar una imagen, solo para desarrollo
router
  .route('/usuarios/imagen')
  .get(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    res.sendfile("./vistas/ImagenUsuario.html");
});

// actualizar la foto de perfil
router
  .route('/usuarios/imagen/:id')
  .post(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    // Valida que se haya subido la imagen
    if (typeof (done) === 'udefined')
        res.end({ 'Error': 'Problemas al subir el archivo, verifique que el archivo este correcto' });
    if (done == true) {
        dbUsuario.actualizarImagen(req.params.id, req.files.imagenUsuario.name, res);
    }
});

// consulta la imagen del perfil
router
  .route('/usuarios/imagen/:id')
  .get(function (req, res) {
    dbUsuario.consultarImagen(req.params.id, res);
});

module.exports = router;