/**
 *  Sectores de ocupaciones o actividades
 */
var mongoose = require('../datos/cliente');
var Schema = mongoose.Schema;

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');

var sectorSchema = new Schema({
    nombre: { type: String, required: true, unique: true , trim: true }
});

// adiciona las validaciones de campos únicos
sectorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Sector', sectorSchema);