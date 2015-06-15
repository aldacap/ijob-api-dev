/*
 * CRUD para los sectores, realiza todas las operaciones sobre la BD
 */

function DBSector() {
    var modeloSector = require('../modelos/Sector');
    var modeloOcupacion = require('../modelos/Ocupacion');
    // referencia privada a la respuesta HTTP
    var response;
    
    var ObjectId = require('mongoose').Types.ObjectId;
    var idOtroSector = new ObjectId('557df15fa8d8bf84148ddfea');
    var idOtraOcupacion = new ObjectId('557e116b7e4ea9b81e000002');
    
    var async = require('async');
    
    // Adiciona un nuevo sector al sistema
    this.crearSector = function (reqSector, res) {
        response = res;
        // instancia un sector con los datos que vienen en el request
        var nuevoSector = new modeloSector(reqSector.body);
        nuevoSector.save(onSectorGuardado);
    }
    
    // resultado de guardar un sector
    function onSectorGuardado(err, sectorGuardado) {
        if (err) return response.send(err);
        response.send({ message: 'OK, sector adicionado', _id: sectorGuardado._id });
    }
    
    // consulta los sectores
    this.consultarSectores = function (res) {
        response = res;
        modeloSector.find(onEncontrarSectores, '_id nombre');
    }
    
    function onEncontrarSectores(err, sectores) {
        if (err) return res.send(err);
        response.json(sectores);
    }
    
    // consulta las ocupaciones
    this.consultarOcupaciones = function (res) {
        response = res;
        modeloOcupacion.find(onEncontrarOcupaciones, '_id nombre _sector');
    }
    
    function onEncontrarOcupaciones(err, ocupaciones) {
        if (err) return res.send(err);
        response.json(ocupaciones);
    }
    
    // consulta una ocupacion por su id, si no la encuentra, la crea y retorna el id
    // la libreria async se utiliza para sincronizar el llamado a los métodos, ya que 
    // es necesario que se ejecuten en orden.
    this.consultarID = function (pNombre, onIDEncontrado) {
        var encontrado = false;
        async.series([
            // consulta una ocupacion por su nombre
            function (callback) {
                var filtroNombre = new RegExp(pNombre, 'i');
                modeloOcupacion
                .findOne({ nombre: filtroNombre })
                .select('nombre')
                .exec(function onOcupacionEncontrada(err, ocupacionEncontrada) {
                    if (ocupacionEncontrada) {
                        encontrado = true;
                        callback(null, ocupacionEncontrada._id);
                    }
                    else {
                        callback(null);
                    }
                });
            },
            // crea una nueva ocupacion cuando no existe
            function (callback) {
                if (!encontrado) {
                    var nuevaOcupacion = new modeloOcupacion();
                    nuevaOcupacion.nombre = pNombre;
                    nuevaOcupacion._sector = idOtroSector
                    nuevaOcupacion.save(function onOcupacionGuardada(err, ocupacionGuardada) {
                        if (ocupacionGuardada) callback(null, ocupacionGuardada._id);
                    });
                }
                else {
                    callback(null);
                }
            }
            // finalmente, retorna un id encontrado, uno nuevo o uno por defecto correspondiente a "Otra".
        ], function (err, results) {
            if (results[0])
                onIDEncontrado(null, results[0]);
            else if (results[1])
                onIDEncontrado(null, results[1]);
            else
                onIDEncontrado(null);
        });
    }
}

module.exports = DBSector;
