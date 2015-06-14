/**
 *  Niveles de estudio
 */
var mongoose = require('mongoose');
var cliente = require('../datos/cliente');
var Schema = mongoose.Schema;

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');

var escolaridadSchema = new Schema({
    nombre: { type: String, required: true  , unique: true, trim: true }
});

// adiciona las validaciones de campos únicos
escolaridadSchema.plugin(uniqueValidator);

module.exports = cliente.model('Escolaridad', escolaridadSchema);