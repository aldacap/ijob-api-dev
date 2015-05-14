/*
 * CRUD para los Calificacion, realiza todas las operaciones sobre la BD
 */

function DBCalificacion() {
    var modeloCalificacion = require('../modelos/Calificacion');
    // referencia privada a la respuesta HTTP
    var response;
    
    // Adiciona una nueva calificacion
    this.agregarCalificacion = function (reqCalificacion, res) {
        response = res;        
        var c = parseInt(reqCalificacion.body.calidad, 10);
        var r = parseInt(reqCalificacion.body.respeto, 10);
        var p = parseInt(reqCalificacion.body.puntualidad, 10);
        var result = Math.round((c + r + p) * 10 / 3) / 10;
        reqCalificacion.body.puntuacion = result;
       
        // instancia una calificacion con los datos que vienen en el request
        var nuevaCalificacion = new modeloCalificacion(reqCalificacion.body);
        nuevaCalificacion.save(onCalificacionGuardada);
    }
    
    // resultado de guardar una calificacion
    function onCalificacionGuardada(err, calificacionGuardada) {
        if (err) {
            return response.send(err);
        }
        response.send({ message: 'OK, calificacion adicionada', _id: calificacionGuardada._id });
    }
    
    this.consultarCalificacion = function (pUsuario, pCantidad, res) {
        response = res;
        
        modeloCalificacion
         .find({ usuario: pUsuario })
         .sort({ 'fecha': 'descending' })
         .limit(pCantidad)
         .exec(onEncontrarCalificaciones);
    }
    
    function onEncontrarCalificaciones(err, calificaciones) {
        if (err) {
            return res.send(err);
        }
        response.json(calificaciones);
    }
}

module.exports = DBCalificacion;
