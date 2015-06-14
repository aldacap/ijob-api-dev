// Todas las personas que tengan acceso al aplicativo
var mongoose = require('mongoose');
var cliente = require('../datos/Cliente.js');
// valida los campos únicos
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    // registro
    nombre: { type: String, required: true },
    apellidos: String,
    nacimiento: Date, 
    genero: { type: String, required: true, enum: ['Masculino', 'Femenino'] },
    correo : { type: String, required: true, unique: true },
    clave: { type: String, requerid: true },
    // perfil - mi imagen,  id de la imagen guardada en la bd de imagenes
    _imagen : { type: Schema.Types.ObjectId }, 
    // perfil - datos personales
    cedula: { type: Number, unique: true },
    // perfil - ocupación
    _sectores : [{ type: Schema.ObjectId, ref: 'Sector' }],
    experiencia: Number,
    // perfil - ocupación - nivel de estudios 1: bachiller, 2:técnico, 3:tecnológico, 4:profesional, 5:posgrado
    nivel: { type: Number, default: 0, enum: [1, 2, 3, 4, 5] },
    cursos: String,
    ocupacion: String,
    // perfil - informacion de contacto
    _ubicacion : { type: Schema.ObjectId , ref: 'Ubicacion' },
    telefono: Number,
    mostrarCorreo: { type: Boolean, required: true, default: false },
    mostrarTelefono: { type: Boolean, required: true, default: false },
    mostrarAPP: { type: Boolean, required: true, default: false },
    direccion: { type: String },
    // busquedas
    calificacion: { type: Number },   
    // busquedas - estados: 1:registrado, 2:confirmado, 3:completado, 4:disponible, 5:no disponible
    estado: { type: Number, default: 0, enum: [1, 2, 3, 4, 5] },
    // administración del usuario
    creado: Date,
    modificado: Date,
    activo: { type: Boolean, required: true },
    // uuid para autenticación de los servicios
    token: { type: String, required: true },
    admin : { type: Boolean, required : true },    
});

// adiciona las validaciones de campos únicos
usuarioSchema.plugin(uniqueValidator);
module.exports = cliente.model('Usuario', usuarioSchema);