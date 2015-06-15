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
    
    //var idUsuarioOcupacion;
    var nombreOcupacion;
    var indiceOcupacionUsuario;
    var callbackActualizarOcupacion;
    // Consulta una ocupacion, si no la encuentra la crea y retorna el id
    this.buscarOcupacionID = function (pNombre, indiceOcupacion, callbackOcupacion) {
        // idUsuarioOcupacion = idUsuario;
        nombreOcupacion = pNombre;
        indiceOcupacionUsuario = indiceOcupacion;
        callbackActualizarOcupacion = callbackOcupacion;
        var filtroNombre = new RegExp(pNombre, 'i');
        modeloOcupacion.findOne({ nombre: filtroNombre }, 'nombre', function onOcupacionEncontrada(err, ocupacionEncontrada) {
            if (err) callbackActualizarOcupacion(idOtraOcupacion, indiceOcupacionUsuario);
            if (!ocupacionEncontrada) {
                crearOcupacion(nombreOcupacion, indiceOcupacionUsuario);
            } else {
                callbackActualizarOcupacion(ocupacionEncontrada._id, indiceOcupacionUsuario);
            }
        });
    }
    
    // si no hay un error al crear la ocupacion, invoca la funciona para pasada en la busqueda
    function crearOcupacion(pNombre, indice) {
        var nuevaOcupacion = new modeloOcupacion();
        nuevaOcupacion.nombre = pNombre;
        nuevaOcupacion._sector = idOtroSector
        nuevaOcupacion.save(function onOcupacionCreada(err, ocupacionGuardada) {
            if (err)
                callbackActualizarOcupacion(idOtraOcupacion, indice);
            else
                callbackActualizarOcupacion(ocupacionGuardada._id, indice);
        });
    }
}

module.exports = DBSector;
