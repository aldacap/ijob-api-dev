// textos descriptivos que se utilizan en la interfaz de la app
var mongoose = require('mongoose');
var cliente = require('../datos/cliente');
var Schema = mongoose.Schema;

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');

var etiquetaSchema = new Schema({
    nombre: { type: String, required: true, unique: true , trim: true },
    esCO: { type: String, required: true, trim: true }
});

// adiciona las validaciones de campos únicos
etiquetaSchema.plugin(uniqueValidator);

module.exports = cliente.model('Etiqueta', etiquetaSchema);