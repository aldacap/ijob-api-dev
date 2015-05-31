/*
 * CRUD para las Busquedas
 */

function DBBusqueda(){

    var modeloUsuario = require('../modelos/Usuario');
    var response;

    // Obtiene datos de la busqueda
    this.buscarPerfiles = function (pOcupacion, res) {
        response = res;

        modeloUsuario
        .find({ 'ocupaciones.nombre': { $regex: pOcupacion, $options: "i" } })
        .and({'activo': 'true'})
        .sort({ 'calificacion': 'descending' })
        .limit(10)
        .exec(onBuscarPerfiles);
    }
    
    // resultado de la busqueda
    function onBuscarPerfiles(err, perfiles) {
        if (err) {
            return res.send(err);
        }
        response.json(perfiles);
    }
}

module.exports = DBBusqueda;