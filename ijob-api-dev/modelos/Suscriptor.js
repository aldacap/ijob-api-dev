// Todas las personas que se suscriban a las noticias en la landing page
var mongoose = require('mongoose');
var cliente = require('../datos/Cliente.js');
// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var suscriptorSchema = new Schema({
    correo : { type: String, required: true, unique: true },
    creado: Date,
    modificado: Date,
    activo: { type: Boolean, required: true }
});

// adiciona las validaciones de campos únicos
suscriptorSchema.plugin(uniqueValidator);
module.exports = cliente.model('Suscriptor', suscriptorSchema);