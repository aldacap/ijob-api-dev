/**
 *  Contacto
 */
var mongoose = require('mongoose');
var cliente = require('../datos/cliente');

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
// estados: 0:pendiente, 1:aceptado, 2: rechazado, 3:calificado, 4:finalizado
var contactoSchema = new Schema({
    fecha: { type: Date, default: Date.now },
    estado: { type: Number, default: 0, enum: [0,1,2,3,4]  },
    _usuarioSolicita : { type: Schema.Types.ObjectId, ref: 'Usuario' },
    _usuarioRecibe : { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


// adiciona validación de campos únicos
contactoSchema.plugin(uniqueValidator);

module.exports = cliente.model('Contacto', contactoSchema);