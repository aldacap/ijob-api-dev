// Cliente de base de datos
var cliente = require('mongoose');

// carga la cadena de conexión del archivo de configuración
var config = require('../config.json');
var connectionString = config.devDatConnStr;

// abre una conexión a la base de datos
cliente.connect(connectionString);

module.exports = cliente;