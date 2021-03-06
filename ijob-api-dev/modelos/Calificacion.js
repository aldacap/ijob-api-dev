﻿/**
 *  Calificaciones
 */
var mongoose = require('mongoose');
var cliente = require('../datos/cliente');

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

// estados: 0:pendiente, 1:realizada, 2:automatica
var calificacionSchema = new Schema({
    fecha: { type: Date, default: Date.now },
    tipoCalificacion: { type: Number, required: true },
    puntuacion: { type: Number },
    calidad: { type: Number },
    respeto: { type: Number },
    puntualidad: { type: Number },
    orientacion: { type: Number },
    observaciones: { type: String },
    _usuarioOtorga : { type: Schema.Types.ObjectId, ref: 'Usuario' },
    _usuarioRecibe : { type: Schema.Types.ObjectId, ref: 'Usuario' },
    _idContacto : { type: Schema.Types.ObjectId, ref: 'Contacto' },
    estadoCalificacion: { type: Number, required: true, enum: [0, 1, 2] }
});

// adiciona las validaciones de campos únicos
calificacionSchema.plugin(uniqueValidator);

module.exports = cliente.model('Calificacion', calificacionSchema);