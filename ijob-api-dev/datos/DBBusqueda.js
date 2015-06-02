/*
 * CRUD para las Busquedas
 */

function DBBusqueda(){

    var modeloUsuario = require('../modelos/Usuario');
    var response;

    // Obtiene datos de la busqueda
    this.buscarPerfiles = function (pOcupacion, pCantidad, res) {
        response = res;

        modeloUsuario
        .find({ 'ocupaciones.nombre': { $regex: pOcupacion, $options: "i" } })
        .and({'activo': 'true'})
        .sort({ 'calificacion': 'descending' })
        .limit(10 * pCantidad)
        //.populate('_imagen')
        .select('nombre apellidos calificacion ocupaciones genero')
        .exec(onBuscarPerfiles);
    }
    
    // resultado de la busqueda
    function onBuscarPerfiles(err, perfiles) {
        if (err) {
            return res.send(err);
        }
        response.json(perfiles);
    }

    // Obtiene datos de la busqueda
    this.buscarAvanzada = function (pOcupacion, pCiudad, pCategoria, pCalificacion, pExperiencia, res) {
        response = res;
        if (!pExperiencia) {
            pExperiencia = 0;
        } 
        
        modeloUsuario
        .find({ 'ocupaciones.nombre': { $regex: pOcupacion, $options: "i" } })
        .and({ 'ocupaciones.experiencia': { $gte: pExperiencia } })
        .and({ 'activo': 'true' })
        .sort({ 'calificacion': 'descending' })
        .limit(10)
        .exec(onBuscarAvanzada);
    }
    
    // resultado de la busqueda
    function onBuscarAvanzada(err, perfiles) {
        if (err) {
            return res.send(err);
        }
        response.json(perfiles);
    }
}

module.exports = DBBusqueda;