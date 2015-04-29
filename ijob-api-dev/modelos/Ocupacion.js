/**
 * Servicio que presta un usuario
 */
var mongoose = require('../datos/cliente');
var Schema = mongoose.Schema;

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');

var ocupacionSchema = new Schema({
    nombre: { type: String, required: true  , unique: true, trim: true },
    descripcion: { type: String, required: true },
    _sector : { type: Schema.Types.ObjectId, ref: 'Sector' },
});

// adiciona las validaciones de campos únicos
ocupacionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Ocupacion', ocupacionSchema);