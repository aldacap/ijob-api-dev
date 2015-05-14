/**
 *  Contacto
 */

var mongoose = require('../datos/cliente');

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var contactoSchema = new Schema({
    fecha: { type: Date, default: Date.now },
    estado: { typpe: Number, required: true },
    _usuarioSolicita : { type: Schema.Types.ObjectId, ref: 'Usuario' },
    _usuarioRecibe : { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


// adiciona validación de campos únicos
contactoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Calificacion', contactoSchema);