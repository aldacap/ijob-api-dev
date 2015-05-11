//// Cliente de imagenes,se utiliza una bd diferente por desempeño y modificabilidad
//var clienteImagenes = require('mongoose');
//var Schema = clienteImagenes.Schema;

//// este valor se debería obtener de un archivo de configuración
//var dbName = 'ijobi';
//var connectionString = 'mongodb://localhost:27017/' + dbName;
////connectionString = 'mongodb://k1_user:k1_pass@ds043329.mongolab.com:43329/k1db';
//var Grid = require('gridfs-stream');
//Grid.mongo = clienteImagenes.mongo;
//var conn = clienteImagenes.createConnection(connectionString);

//module.exports = conn;