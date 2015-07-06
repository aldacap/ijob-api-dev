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

// consulta un usuario por su ID
router
  .route('/usuarios/:id')
  .get(function (req, res) {
    dbUsuario.consultarUsuario(req.params.id , res);
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
    dbUsuario.registrarUsuario(req.body, res);
});

// termina el registro de un usuario al confirmar su correo
router
  .route('/usuarios/registrar/:id')
  .get(function (req, res) {
    dbUsuario.terminarRegistro(req.params.id, res);
});

// formulario de ejemplo que implementa el algoritmo de encriptación
router
  .route('/usuarios/cifrar/ejemplo')
  .get(function (req, res) {
    res.sendfile("./vistas/cifrar.html");
});

// actualizar la información personal de un usuario
router
  .route('/usuarios/personal/:id')
  .put(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    // solo se permite para usuarios confirmados    
    if (req.user.estado >= dbUsuario.estados.Confirmado) {
        dbUsuario.actualizarInformacion(req.params.id , req.body, res);
    }
    else {
        res.statusCode = 403;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.send({ message: 'Error, primero debe confirmar el correo' });
    }
});

// actualizar la ocupacion de  un usuario
router
  .route('/usuarios/ocupacion/:id')
  .put(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    // solo se permite para usuarios confirmados    
    if (req.user.estado >= dbUsuario.estados.Completado) {
        dbUsuario.actualizarOcupacion(req.params.id , req.body, res);
    }
    else {
        res.statusCode = 403;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.send({ message: 'Error, primero debe completar su información personal' });
    }
});

// actualizar la ubicación de un usuario
router
  .route('/usuarios/ubicacion/:id')
  .put(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    // solo se permite para usuarios confirmados    
    if (req.user.estado >= dbUsuario.estados.Confirmado) {
        dbUsuario.actualizarUbicacion(req.params.id , req.body, res);
    }
    else {
        res.statusCode = 403;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.send({ message: 'Error, pprimero debe completar su información personal' });
    }
});

// actualizar la clave de un usuario
router
  .route('/usuarios/clave/:id')
  .put(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    // solo se permite para usuarios confirmados    
    if (req.user.estado >= dbUsuario.estados.Confirmado) {
        dbUsuario.actualizarClave(req.params.id , req.body, res);
    }
    else {
        res.statusCode = 403;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.send({ message: 'Error, primero debe confirmar el correo' });
    }
});

// formulario para cargar una imagen, solo para desarrollo
router
  .route('/usuarios/imagen/subir')
  .get(function (req, res) {
    res.sendfile("./vistas/ImagenUsuario.html");
});

// actualizar la foto de perfil
router
  .route('/usuarios/imagen/:id')
  .post(function (req, res) {
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

// cambia la disponibilidad de un usuario
router
  .route('/usuarios/disponible/:id')
  .put(seguridad.authenticate('bearer', { session: false }), function (req, res) {
    // solo se permite para usuarios Disponibles con alguna ocupacion   
    if (req.user.estado >= dbUsuario.estados.Disponible) {
        var bolDsiponible = req.body.disponible === 'true' ? true : false;
        dbUsuario.cambiarDisponibilidad(req.params.id , bolDsiponible , res);
    }
    else {
        res.statusCode = 403;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.send({ message: 'Error, debe registrar al menos una ocupación' });
    }
});

// ciclo de vida de un usuario
router
  .route('/usuario-estados')
  .get(function (req, res) {
    res.send({ EstadosUsuario: dbUsuario.estados });
});

// nivel de escolaridad
router
  .route('/usuario-escolaridad')
  .get(function (req, res) {
    res.send({ NivelesEstudios: dbUsuario.niveles });
});

// genero de la persona
router
  .route('/usuario-genero')
  .get(function (req, res) {
    res.send({ Generos: dbUsuario.generos });
});

module.exports = router;