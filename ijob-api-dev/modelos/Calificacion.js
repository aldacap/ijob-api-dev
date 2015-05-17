/**
 *  Calificaciones
 */
var mongoose = require('mongoose');
var cliente = require('../datos/cliente');

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var calificacionSchema = new Schema({
    fecha: { type: Date, default: Date.now },
    puntuacion: { type: Number, required: true},
    calidad: { type: Number, required: true },
    respeto: { type: Number, required: true },
    puntualidad: { type: Number, required: true },
    observaciones: { type: String },
    _usuarioOtorga : { type: Schema.Types.ObjectId, ref: 'Usuario' },
    _usuarioRecibe : { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


// adiciona las validaciones de campos únicos
calificacionSchema.plugin(uniqueValidator);

module.exports = cliente.model('Calificacion', calificacionSchema);