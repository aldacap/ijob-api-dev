/*
 * CRUD para los Ubicaciones, realiza todas las operaciones sobre la BD
 */

function DBUbicacion() {
    var modeloUbicacion = require('../modelos/Ubicacion');
    // referencia privada a la respuesta HTTP
    var response;
    
    // Adiciona un nuevo Ubicacion al sistema
    this.crearUbicacion = function (reqUbicacion, res) {
        response = res;
        // instancia un Ubicacion con los datos que vienen en el request
        var nuevoUbicacion = new modeloUbicacion(reqUbicacion.body);
        nuevoUbicacion.save(onUbicacionGuardada);
    }
    
    // resultado de guardar un Ubicacion
    function onUbicacionGuardada(err, ubicacionGuardada) {
        if (err) return response.send(err);
        response.send({ message: 'OK, Ubicacion adicionado', _id: ubicacionGuardada._id });
    }
    
    this.consultarUbicaciones = function (res) {
        response = res;
        modeloUbicacion.find(onEncontrarUbicaciones);
    }
    
    function onEncontrarUbicaciones(err, Ubicaciones) {
        if (err) return res.send(err);
        response.json(Ubicaciones);
    }
}

module.exports = DBUbicacion;
