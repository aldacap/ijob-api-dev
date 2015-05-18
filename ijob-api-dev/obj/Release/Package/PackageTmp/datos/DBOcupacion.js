///*
// * CRUD para los ocupaciones, realiza todas las operaciones sobre la BD
// */

//function DBOcupacion() {
//    var modeloOcupacion = require('../modelos/Ocupacion');
//    // referencia privada a la respuesta HTTP
//    var response;
    
//    // Adiciona un nuevo ocupacion al sistema
//    this.crearOcupacion = function (reqOcupacion, res) {
//        response = res;
//        // instancia un ocupacion con los datos que vienen en el request
//        var nuevaOcupacion = new modeloOcupacion(reqOcupacion.body);
//        nuevaOcupacion.save(onOcupacionGuardada);
//    }
    
//    // resultado de guardar un ocupacion
//    function onOcupacionGuardada(err, ocupacionGuardada) {
//        if (err) {
//            return response.send(err);
//        }
//        response.send({ message: 'OK, ocupacion adicionado', _id: ocupacionGuardada._id });
//    }
    
//    this.consultarOcupaciones = function (res) {
//        response = res;
//        modeloOcupacion
//        .find(onEncontrarOcupaciones)
//        .populate('_sector');
//    }
    
//    function onEncontrarOcupaciones(err, ocupaciones) {
//        if (err) {
//            return res.send(err);
//        }
//        response.json(ocupaciones);
//    }
//}

//module.exports = DBOcupacion;
