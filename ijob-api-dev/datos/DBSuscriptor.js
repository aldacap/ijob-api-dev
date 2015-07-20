/*
 * CRUD para suscriptores a los boletines de noticias
 */

function DBSuscriptor() {
    var modeloSuscriptor = require('../modelos/Suscriptor');
    var modeloAuditoria = require('../modelos/Auditoria');
    var audit = new modeloAuditoria();
    var mongoose = require('mongoose');
    // referencia privada a la respuesta HTTP
    var response;
    
    // Adiciona un nuevo suscriptor al sistema
    this.registrarSuscriptor = function (reqSuscriptor, res) {
        response = res;
        // instancia un suscriptor con los datos que vienen en el request
        var nuevoSuscriptor = new modeloSuscriptor();
        nuevoSuscriptor.correo = reqSuscriptor.correo.toLowerCase();
        nuevoSuscriptor.activo = true;
        nuevoSuscriptor.creado = Date.now();
        nuevoSuscriptor.save(onSuscriptorGuardado);
    }
    
    // resultado de guardar un suscriptor
    function onSuscriptorGuardado(err, suscriptorGuardado) {
        if (err) { return response.send(err); }        
        response.send({ message: 'OK, suscriptor adicionado', _id: suscriptorGuardado._id, creado: suscriptorGuardado.creado });
    }    
}

module.exports = DBSuscriptor;
