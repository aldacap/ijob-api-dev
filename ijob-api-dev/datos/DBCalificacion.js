/*
 * CRUD para los Calificacion, realiza todas las operaciones sobre la BD
 */

function DBCalificacion() {
    var modeloCalificacion = require('../modelos/Calificacion');
    var modeloContacto = require('../modelos/Contacto');
    var modeloUsuario = require('../modelos/Usuario');
    // referencia privada a la respuesta HTTP
    var response;
        
    // Crea calificaciones
    this.crearCalificacion = function (req, tipo) {
        var nuevaCalificacion = new modeloCalificacion();
        if (tipo == 1) {
            nuevaCalificacion._usuarioOtorga = req._usuarioSolicita;
            nuevaCalificacion._usuarioRecibe = req._usuarioRecibe;
        }
        else {
            nuevaCalificacion._usuarioOtorga = req._usuarioRecibe;
            nuevaCalificacion._usuarioRecibe = req._usuarioSolicita;
        }

        nuevaCalificacion.fecha = new Date();
        nuevaCalificacion.tipoCalificacion = tipo;
        nuevaCalificacion.estadoCalificacion = 0;
        nuevaCalificacion._idContacto = req._id;
        nuevaCalificacion.save();
    }
    
    // Adiciona una nueva calificacion
    this.agregarCalificacion = function (reqCalificacion, res) {
        response = res;
        var vCalidad = parseInt(reqCalificacion.body.calidad, 10);
        var vRespeto = parseInt(reqCalificacion.body.respeto, 10);
        var vPuntualidad = parseInt(reqCalificacion.body.puntualidad, 10);
        var vOrientacion = parseInt(reqCalificacion.body.orientacion, 10);
        var resultado = Math.round((vCalidad + vRespeto + vPuntualidad + vOrientacion) * 10 / 3) / 10;
        
        modeloCalificacion.findOne({ _id: reqCalificacion.body.idCalificacion }, function (err, calificacion) {
            if (err) {
                return response.send(err);
            }
            calificacion.puntuacion = resultado;
            var vFecha = new Date();
            calificacion.fecha = vFecha;
            
            calificacion.calidad = vCalidad;
            calificacion.respeto = vRespeto;
            calificacion.puntualidad = vPuntualidad;
            calificacion.orientacion = vOrientacion;
            calificacion.estadoCalificacion = 1;
            calificacion.observaciones = reqCalificacion.body.observaciones;
            
            // se actualiza la calificacion pendiente
            calificacion.save(onCalificacionActualizada);
        });
    }
    
    // Resultado de actualizar una calificacion pendiente
    function onCalificacionActualizada(err, calificacionActualizada) {
        if (err) return response.send(err);
        
        // actualiza la calificacion del usuario        
        var vCalAnt = modeloUsuario.findById(calificacionActualizada._usuarioRecibe);
        // FALTA ACTUALIZAR LA CALIFICACION 
       // console.log(vCalAnt);        

        // instancia una solicitud de contacto para actualizar el estado
        modeloContacto.findOne({ _id: calificacionActualizada._idContacto }, function onContactoEncontrado(err, contactoEncontrado) {
            if (err) {
                return response.send(err);
            }
            var estado = contactoEncontrado.estado;
            if (estado == 1) {
                contactoEncontrado.estado = 3;
            }
            else {
                contactoEncontrado.estado = 4;
            }
            
            contactoEncontrado.save(function onContactoActualizado(err, contactoActualizado) {
                if (err) return response.send(err);
                response.send({ message: 'OK, calificacion actualizada', _id: calificacionActualizada._id });
            });
        });
    }
    
    // resultado de actualizar el estado de una solicitud de contacto
    
    // Obtiene calificaciones otorgadas o recibidas
    this.consultarCalificacion = function (pUsuario, pCantidad, pTipo, res) {
        response = res;
        if (pTipo == 1) {
            modeloCalificacion
            .find({ _usuarioOtorga: pUsuario, estadoCalificacion: 1 })
            .sort({ 'fecha': 'descending' })
            .limit(pCantidad)
            .exec(onEncontrarCalificaciones);
        } else {
            modeloCalificacion
            .find({ _usuarioRecibe: pUsuario, estadoCalificacion: 1 })
            .sort({ 'fecha': 'descending' })
            .limit(pCantidad)
            .exec(onEncontrarCalificaciones);
        }
    }
    
    // resultado de consultar calificaciones
    function onEncontrarCalificaciones(err, calificaciones) {
        if (err) {
            return res.send(err);
        }
        response.json(calificaciones);
    }

    // Obtiene calificaciones pendientes
    this.buscarCalificacion = function (pUsuario, res) {
        response = res;
            modeloCalificacion
            .find({ _usuarioOtorga: pUsuario, estadoCalificacion: 0 })
            .sort({ 'fecha': 'ascending' })
            .exec(onBuscarCalificaciones);        
    }
    
    // resultado de consultar calificaciones pendientes
    function onBuscarCalificaciones(err, calificaciones) {
        if (err) {
            return res.send(err);
        }
        response.json(calificaciones);
    }
}

module.exports = DBCalificacion;
