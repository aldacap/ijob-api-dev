///**
// *  api para los sectors
// */

//var express = require('express');
//var router = express.Router();

//var DBOcupacion = require('../datos/DBOcupacion');
//var dbOcupacion = new DBOcupacion();

//router
//  .route('/ocupaciones')
//  .get(function (req, res) {
//    dbOcupacion.consultarOcupaciones(res);
//});

///**
// *  registra la información básica de un sector
// */
//router
//  .route('/ocupaciones')
//  .post(function (req, res) {
//    dbOcupacion.crearOcupacion(req, res);
//});

//module.exports = router;