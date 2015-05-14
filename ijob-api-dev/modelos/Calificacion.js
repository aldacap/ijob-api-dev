/**
 *  Calificaciones
 */

var mongoose = require('../datos/cliente');

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
    _usuario : { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


// adiciona las validaciones de campos únicos
calificacionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Calificacion', calificacionSchema);