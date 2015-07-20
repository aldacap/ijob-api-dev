// api para los suscriptors
var express = require('express');
var router = express.Router();
var DBSuscriptor = require('../datos/dbSuscriptor');
var dbSuscriptor = new DBSuscriptor();

// registra la información básica de un suscriptor
router
  .route('/suscriptores')
  .post(function (req, res) {
    dbSuscriptor.registrarSuscriptor(req.body, res);
});

module.exports = router;