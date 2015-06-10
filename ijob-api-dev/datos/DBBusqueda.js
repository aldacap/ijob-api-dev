/*
 * CRUD para las Busquedas
 */

function DBBusqueda() {
    
    var modeloUsuario = require('../modelos/Usuario');
    var response;
    
    // Obtiene datos de la busqueda
    this.buscarPerfiles = function (pOcupacion, pCantidad, res) {
        response = res;
        
        modeloUsuario
        .find({ 'ocupaciones.nombre': { $regex: pOcupacion, $options: "i" } })
        .and({ 'activo': 'true' })
        .and({ 'estado': 4 })
        .sort({ 'calificacion': 'descending' })
        .limit(10 * pCantidad)
        .select('_id nombre apellidos calificacion ocupaciones genero')
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
    this.buscarAvanzada = function (req, res) {
        response = res;
        var query = modeloUsuario.find({});
        
        query.where('activo', 'true');
        query.where('estado', 4);
        
        if (req.calificacion) {
            query.where('calificacion').gte(req.calificacion);
        }
        
        if (req.ocupacion) {
            query.where('ocupaciones.nombre').equals(req.ocupacion);
        }
        
        //if (req.ocupacion) {
        //    query.where('ocupaciones.nombre').equals(req.ocupacion);
        //}
        
        //if (req.ocupacion) {
        //    query.where('ocupaciones.nombre').equals(req.ocupacion);
        //}
        
        query.sort({ 'calificacion': 'descending' })
        query.limit(10);
        query.exec(onBuscarAvanzada);

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