/**
 *  Se registran errores generados en la ejecución de os métodos
 */
var mongoose = require('mongoose');
var cliente = require('../datos/cliente');
var Schema = mongoose.Schema;

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');

var auditoriaSchema = new Schema({
    fecha: { type: Date, default: Date.now },
    _idUsuario : { type: Schema.Types.ObjectId, ref: 'Usuario' },    
    metodo: { type: String },
    descripcion: { type: String }

});

// adiciona las validaciones de campos únicos
auditoriaSchema.plugin(uniqueValidator);

module.exports = cliente.model('Auditoria', auditoriaSchema);