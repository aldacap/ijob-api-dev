/*
 * CRUD para los sectores, realiza todas las operaciones sobre la BD
 */

function DBSector() {
    var modeloSector = require('../modelos/Sector');
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
    
    this.consultarSectores = function (res) {
        response = res;
        modeloSector.find(onEncontrarSectores);
    }
    
    function onEncontrarSectores(err, sectores) {
        if (err) return res.send(err);
        response.json(sectores);
    }
}

module.exports = DBSector;
