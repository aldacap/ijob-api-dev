/*
 * CRUD para las Busquedas
 */

function DBBusqueda() {
    
    var modeloUsuario = require('../modelos/Usuario');
    var modeloSector = require('../modelos/Sector');
    var modeloOcupacion = require('../modelos/Ocupacion');
    var mongoose = require('mongoose');
    var response;
    var categoria = null;
    var reqAv;
    
    // Obtiene datos de la busqueda
    this.buscarPerfiles = function (pOcupacion, pCantidad, res) {
        response = res;
        var ubicacion = mongoose.model('Ubicacion');
        var Ocupacion = mongoose.model('Ocupacion');
        var Usuario = mongoose.model('Usuario');
        var query = modeloOcupacion.find({});
        var re = new RegExp();
        var str = '';
        var lon = 0;
        reqAv = pCantidad;
        
        var cadenas = pOcupacion.split(" ");
        lon = cadenas[0].length;
        if (lon > 3) {
            str = cadenas[0].substring(0, lon - 1);
            re = new RegExp(str, 'i');
            query.where('nombre').regex(re);
        } else {
            str = cadenas[0];
            re = new RegExp(str, 'i');
            query.where('nombre').regex(re);
        }

        for (var i = 1; i < cadenas.length; i++) {
            log = cadenas[i].length;
            if (lon > 3) {
                re = new RegExp(cadenas[i], 'i');
                query.where('nombre').regex(re);
            }
        }
        query.select('_id');
        query.exec(onBuscarPerfiles);
    }
    
    // resultado de la busqueda
    function onBuscarPerfiles(err, ocups) {
        if (err) {
            return res.send(err);
        }
        docs = ocups.map(function (ocups) { return ocups._id; });
        var queryPerfil = modeloUsuario.find({});
        queryPerfil.where('_ocupaciones.0').in(docs);
        queryPerfil.where('activo', 'true');
        queryPerfil.where('estado', 4);
        queryPerfil.select('_id nombre apellidos calificacion ocupaciones genero _imagen _ocupaciones _ubicacion');
        queryPerfil.sort({ 'calificacion': 'descending' });
        queryPerfil.skip(10 * (reqAv.cantidad - 1));
        queryPerfil.limit(10 * reqAv.cantidad);
        queryPerfil.populate('_ocupaciones', 'nombre _sector');
        queryPerfil.populate('_ubicacion', 'municipio departamenteo pais');
        queryPerfil.exec(onEncontrarPerfiles);
    }
    
    // Obtiene datos de la busqueda
    this.buscarAvanzada = function (req, res) {
        response = res;
        var Ubicacion = mongoose.model('Ubicacion');
        var Ocupacion = mongoose.model('Ocupacion');
        var Usuario = mongoose.model('Usuario');
        var query = modeloUsuario.find({});
              
        if (req.idCategoria && !req.idOcupacion) {
            reqAv = req;
            var query2 = modeloOcupacion.find({});
            query2.where('_sector', req.idCategoria);
            query2.select('_id');
            query2.exec(onBuscarAvanzada);
        }
        else {

            if (req.calificacion) {
                query.where('calificacion').gte(req.calificacion);
            }
            
            if (req.idOcupacion) {
                query.where('_ocupaciones.0').equals(req.idOcupacion);
            }
            
            if (req.idCiudad) {
                query.where('_ubicacion').equals(req.idCiudad);
            }

            query.where('activo', 'true');
            query.where('estado', 4);
            query.select('_id nombre apellidos calificacion ocupaciones genero _imagen _ocupaciones _ubicacion');
            query.sort({ 'calificacion': 'descending' });
            query.skip(10 * (req.cantidad - 1));
            query.limit(10 * req.cantidad);
            query.populate('_ocupaciones', 'nombre _sector');
            query.populate('_ubicacion', 'municipio departamenteo pais');
            query.exec(onEncontrarPerfiles);
        }
    }
    
    // resultado de la busqueda
    function onBuscarAvanzada(err, ocups) {
        if (err) {
            return res.send(err);
        }
        docs = ocups.map(function (ocups) { return ocups._id; });
        var queryPerfil = modeloUsuario.find({});
        queryPerfil.where('_ocupaciones.0').in(docs);
        
        if (reqAv.idOcupacion) {
            queryPerfil.where('_ocupaciones.0').equals(reqAv.idOcupacion);
        }
        
        if (reqAv.idCiudad) {
            queryPerfil.where('_ubicacion').equals(reqAv.idCiudad);
        }

        queryPerfil.where('activo', 'true');
        queryPerfil.where('estado', 4);
        queryPerfil.select('_id nombre apellidos calificacion ocupaciones genero _imagen _ocupaciones _ubicacion');
        queryPerfil.sort({ 'calificacion': 'descending' });
        queryPerfil.skip(10 * (reqAv.cantidad - 1));
        queryPerfil.limit(10 * reqAv.cantidad);
        queryPerfil.populate('_ocupaciones', 'nombre _sector');
        queryPerfil.populate('_ubicacion', 'municipio departamenteo pais');
        queryPerfil.exec(onEncontrarPerfiles);
    }
    
    function onEncontrarPerfiles(err, perfiles) {
        if (err) {
            return res.send(err);
        }
        response.json(perfiles);
    }
}

module.exports = DBBusqueda;