/**
 *  api para los usuarios
 */

var express = require('express');
var router = express.Router();
var uuid = require('uuid'); // modulo para generar los token

var dbUsuario = require('../datos/dbUsuario');
var dbUsr = new dbUsuario();

// autentica un usuario mediante correo y clave
router.route('/autenticar/:correo/:clave')
    .get(function (req, res) {
    
    
    dbUsr.autenticar(req.params.correo, req.params.clave, res);
    
   // res.json(ret);

});

module.exports = router;