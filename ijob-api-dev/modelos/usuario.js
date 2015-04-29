/**
 *  Todas las personas que tengan acceso al aplicativo
 */

var mongoose = require('../datos/cliente');

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    correo : { type: String, required: true, unique: true },
    clave: { type: String, requerid: true },
    nombre: { type: String, required: true },
    apellidos: String,
    cedula: { type: Number, unique: true },
    genero: { type: String, unique: true },
    nacimiento: Date, 
    _ubicacion : { type: Schema.Types.ObjectId, ref: 'Ubicacion' },
    ocupaciones : [{ type: Schema.Types.ObjectId, ref: 'Ocupacion' }],
    direccion: { type: String },
    foto: Buffer,
    creado: Date,
    modificado: Date,
    activo: { type: Boolean, required: true },
    // uuid para autenticación de los servicios
    token: { type: String, required: true },
    admin : { type: Boolean, required : true }
});


// adiciona las validaciones de campos únicos
usuarioSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Usuario', usuarioSchema);