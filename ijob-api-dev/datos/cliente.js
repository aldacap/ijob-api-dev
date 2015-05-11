// Cliente de base de datos
var cliente = require('mongoose');

// datos
// este valor se debería obtener de un archivo de configuración
var dbName = 'k1db';
var connectionString = 'mongodb://localhost:27017/' + dbName;
//connectionString = 'mongodb://k1_user:k1_pass@ds043329.mongolab.com:43329/k1db';
// abre una conexión a la base de datos
cliente.connect(connectionString);

module.exports = cliente;