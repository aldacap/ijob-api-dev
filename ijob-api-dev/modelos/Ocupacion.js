/**
 *  Ocupaciones o actividades
 */
var mongoose = require('mongoose');
var cliente = require('../datos/cliente');
var Schema = mongoose.Schema;

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');

var ocupacionSchema = new Schema({
    nombre: { type: String, required: true  , unique: true, trim: true },
    _sector : { type: Schema.ObjectId, ref: 'Sector' }
});

// adiciona las validaciones de campos únicos
ocupacionSchema.plugin(uniqueValidator);

module.exports = cliente.model('Ocupacion', ocupacionSchema);