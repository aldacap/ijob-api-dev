/*
 * CRUD para los Contactos, realiza todas las operaciones sobre la BD
 */

function DBContacto() {
    var modeloContacto = require('../modelos/Contacto');
    var DBCalificacion = require('./DBCalificacion.js');
    var dbCalificacion = new DBCalificacion();
    var mongoose = require('mongoose');
    // referencia privada a la respuesta HTTP
    var response;
    
    // Adiciona una solicitud de contacto
    this.solicitarContacto = function (reqContacto, res) {
        // instancia un contacto con los datos que vienen en el request
        response = res;
        var vFecha = new Date();
        reqContacto.body.fecha = vFecha;
        var nuevoContacto = new modeloContacto(reqContacto.body);
        nuevoContacto.save(onContactoGuardado);
    }
    
    // resultado de guardar una solicitud de contacto
    function onContactoGuardado(err, contactoGuardado) {
        if (err) {
            return response.send(err);
        }
        response.send({ message: 'OK, solicitud de contacto adicionada', _id: contactoGuardado._id });
    }
    
    // Actualiza el estado de una solicitud de contacto
    var vEstado;
    this.actualizarContacto = function (pIdContacto, pEstado, res) {
        response = res;
        vEstado = pEstado;
        
        // instancia una solicitud de contacto con los datos que vienen en el request
        modeloContacto.findOne({ _id: pIdContacto }, onContactoEncontrado);
    }
    
    // resultado de actualizar el estado de una solicitud de contacto
    function onContactoEncontrado(err, contactoEncontrado) {
        if (err) {
            return response.send(err);
        }
        
        // Si se acepta la solicitud de contacto se crean calificaciones pendientes
        if (vEstado == 1) {
            // Se crea calificación
            dbCalificacion.crearCalificacion(contactoEncontrado, 1);
            dbCalificacion.crearCalificacion(contactoEncontrado, 2);
        }
        
        contactoEncontrado.estado = vEstado;
        
        contactoEncontrado.save(function onContactoActualizado(err, contactoActualizado) {
            if (err) return response.send(err);
            response.send({ message: 'OK, contacto actualizado', _id: contactoActualizado._id });
        });
    }
    
    // Obtener solicitudes de contacto pendientes
    this.consultarSolicitudes = function (pUsuario, pTipo, res) {
        response = res;
        
        var usuario = mongoose.model('Usuario');
        var query = modeloContacto.find({});
        
        query.where('estado', 0);
        
        if (pTipo == 1) {
            query.where('_usuarioSolicita', pUsuario);
            query.select('fecha _usuarioRecibe');
            query.sort({ 'fecha': 'asc' });
            query.populate('_usuarioRecibe', 'nombre apellidos genero calificacion ocupaciones _imagen');
        }
        else {
            query.where('_usuarioRecibe', pUsuario);
            query.select('fecha _usuarioSolicita');
            query.sort({ 'fecha': 'asc' });
            query.populate('_usuarioSolicita', 'nombre apellidos genero calificacion ocupaciones _imagen');
        }
        
        query.exec(onEncontrarSolicitudes);
    }
    
    // resultado de consultar solicitudes de contacto pendients
    function onEncontrarSolicitudes(err, solicitudes) {
        if (err) {
            return response.send(err);
        }
        response.json(solicitudes);
    }
    
    // Obtener solicitudes de contacto activas
    this.buscarSolicitudes = function (pUsuario, res) {
        response = res;
        modeloContacto
            .find({ 'estado': { $in: [1, 3] } })
            .and([
            { $or: [{ '_usuarioSolicita': pUsuario }, { '_usuarioRecibe': pUsuario }] }
        ])
            .exec(onBuscarSolicitudes);
    }
    
    // resultado de consultar solicitudes de contacto
    function onBuscarSolicitudes(err, solicitudes) {
        if (err) {
            return response.send(err);
        }
        response.json(solicitudes);
    }
}

module.exports = DBContacto;