// Carga y descarga de imagenes
var express = require('express');
var router = express.Router();

var DBImagen = require('../datos/DBImagen');
var dbImagen = new DBImagen();

// formulario para cargar una imagen, solo para desarrollo
router
  .route('/imagenes')
  .get(function (req, res) {
    res.sendfile("./vistas/ImagenSubir.html");
});

// consulta una imagen
router
  .route('/imagenes/:idImagen')
  .get(function (req, res) {
    dbImagen.consultarImagen(req.params.idImagen, res);
});

// este metodo es manejado por el modulo multer
router
  .route('/imagenes')
  .post(function (req, res) {
    if (done == true) {
        var DBImagen = require('../datos/DBImagen');
        var dbImagen = new DBImagen();
        dbImagen.subirImagen(req.files.userPhoto.name, res);
    }
});

module.exports = router;