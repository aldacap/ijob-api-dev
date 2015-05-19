// Todas las personas que tengan acceso al aplicativo
var mongoose = require('mongoose');
var cliente = require('../datos/Cliente.js');

// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var ocupacionSchema = new Schema({
    nombre: { type: String, required: true  , unique: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    experiencia: { type: Number, required: true },
    _sector : { type: Schema.Types.ObjectId, ref: 'Sector' },
});

var usuarioSchema = new Schema({
    correo : { type: String, required: true, unique: true },
    clave: { type: String, requerid: true },
    nombre: { type: String, required: true },
    apellidos: String,
    cedula: { type: Number, unique: true },
    genero: { type: String, required: true, enum: ['Masculino', 'Femenino'] },
    nacimiento: Date, 
    _ubicacion : { type: Schema.Types.ObjectId, ref: 'Ubicacion' },
    ocupaciones : [ocupacionSchema],
    direccion: { type: String },
    // id de la imagen guardada en la bd de imagenes
    _imagen : { type: Schema.Types.ObjectId }, 
    creado: Date,
    modificado: Date,
    activo: { type: Boolean, required: true },
    // uuid para autenticación de los servicios
    token: { type: String, required: true },
    admin : { type: Boolean, required : true }
});


// adiciona las validaciones de campos únicos
usuarioSchema.plugin(uniqueValidator);

module.exports = cliente.model('Usuario', usuarioSchema);