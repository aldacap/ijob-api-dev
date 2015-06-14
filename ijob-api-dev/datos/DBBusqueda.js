/*
 * CRUD para las Busquedas
 */

function DBBusqueda() {
    
    var modeloUsuario = require('../modelos/Usuario');
    var mongoose = require('mongoose');
    var response;
    
    // Obtiene datos de la busqueda
    this.buscarPerfiles = function (pOcupacion, pCantidad, res) {
        response = res;
        var ubicacion = mongoose.model('Ubicacion');
        var query = modeloUsuario.find({});
        var re = new RegExp();
        var str = '';
        var lon = 0;
        
        var cadenas = pOcupacion.split(" ");
        for (var i = 0; i < cadenas.length; i++) {
            longitud = cadenas[i].length;
            if (longitud > 1 && i == 0) {
                lon = cadenas[i].lenght;
                str = cadenas[i].substring(0, lon - 1)
                re = new RegExp(cadenas[i], 'i');
                query.where('ocupaciones.nombre').regex(re);
            }
            if (longitud > 3 && i > 0) {
                re = new RegExp(cadenas[i], 'i');
                query.where('ocupaciones.nombre').regex(re);
            }
        }
        
        query.where('activo', 'true');
        query.where('estado', 4);
        query.sort({ 'calificacion': 'descending' });
        query.skip(10 * (pCantidad - 1));
        query.limit(10 * pCantidad);
        query.select('_id nombre apellidos calificacion ocupaciones genero _imagen');
        //query.populate('_ubicacion', 'departamento municipio');
        query.exec(onBuscarPerfiles);
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
        var ubicacion = mongoose.model('Ubicacion');
        var query = modeloUsuario.find({});
        
        query.where('activo', 'true');
        query.where('estado', 4);
        
        if (req.calificacion) {
            query.where('calificacion').gte(req.calificacion);
        }
        
        if (req.ocupacion) {
            query.where('ocupaciones._id').equals(req.idOcupacion);
        }
        
        if (req.idCiudad) {
            query.where('_ubicacion').equals(req.idCiudad);
        }
        
        if (req.idCategoria) {
            query.where('ocupaciones._sector').equals(req.idCategoria);
        }
        
        query.sort({ 'calificacion': 'descending' });
        query.skip(10 * (req.cantidad - 1));
        query.limit(10 * req.cantidad);
        query.select('_id nombre apellidos calificacion ocupaciones genero _imagen');
        //query.populate('_ubicacion', 'departamento municipio');
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