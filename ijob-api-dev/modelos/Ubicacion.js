// Información geografica
var mongoose = require('mongoose');
var cliente = require('../datos/cliente');

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var ubicacionSchema = new Schema({
    pais: { type: String, required: true },
    departamento: { type: String, required: true },
    municipio: { type: String, required: true },
    codigo: { type: String, required: true, unique: true }
});

// adiciona las validaciones de campos únicos
ubicacionSchema.plugin(uniqueValidator, { message: 'Error, el valor del código debe ser único.' });

// cuando se utilizan varias conexiones a mongoose, se debe registrar
// los modelos con la instancia del cliente
module.exports = cliente.model('Ubicacion', ubicacionSchema);