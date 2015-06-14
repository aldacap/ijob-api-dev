/*
 * CRUD para los sectores, realiza todas las operaciones sobre la BD
 */

function DBSector() {
    var modeloSector = require('../modelos/Sector');
    var modeloOcupacion = require('../modelos/Ocupacion');
    var modeloEscolaridad = require('../modelos/Escolaridad');
    // referencia privada a la respuesta HTTP
    var response;
    
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

    // consulta los niveles de escolaridad
    this.consultarEscolaridad = function (res) {
        response = res;
        modeloEscolaridad.find(onEncontrarEscolaridad, '_id nombre');
    }
    
    function onEncontrarEscolaridad(err, escolaridad) {
        if (err) return res.send(err);
        response.json(escolaridad);
    }
}

module.exports = DBSector;
