/*
 * CRUD para los Contactos, realiza todas las operaciones sobre la BD
 */

function DBContacto() {
    var modeloContacto = require('../modelos/Contacto');
    var DBCalificacion = require('./DBCalificacion.js');
    var dbCalificacion = new DBCalificacion();
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
        if (pTipo == 1) {
            modeloContacto
            .find({ _usuarioSolicita: pUsuario, estado: 0 })
            .exec(onEncontrarSolicitudes);
        }
        else {
            modeloContacto
            .find({ _usuarioRecibe: pUsuario, estado: 0 })
            .exec(onEncontrarSolicitudes);
        }
    }
    
    // Obtener solicitudes de contacto activas
    this.buscarSolicitudes = function (pUsuario, res) {
        response = res;
        modeloContacto
            .find({ 'estado': { $in: [1, 3] } })
            .and([
                { $or: [{ '_usuarioSolicita': pUsuario }, { '_usuarioRecibe': pUsuario }] }
            ])
            .exec(onEncontrarSolicitudes);
    }
    
    // resultado de consultar solicitudes de contacto
    function onEncontrarSolicitudes(err, solicitudes) {
        if (err) {
            return response.send(err);
        }
        response.json(solicitudes);
    }
}

module.exports = DBContacto;