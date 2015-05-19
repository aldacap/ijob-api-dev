// Cliente de base de datos
var cliente = require('mongoose');

// carga la cadena de conexión del archivo de configuración
var config = require('../config.json');
var conexionCliente = cliente.createConnection(config.devImgConnStr);

conexionCliente.on('connected', function onClienteConnected() {
    console.log('Mongoose connected to devImgConnStr');
});

conexionCliente.on('error', function onClienteError(err) {
    console.log('Error on devImgConnStr' + err);
});

conexionCliente.on('disconnected', function onClienteDesconectado() {
    console.log('Desconexion on devImgConnStr');
});

module.exports = conexionCliente;