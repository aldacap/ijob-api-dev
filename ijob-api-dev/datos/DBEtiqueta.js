// Consulta los textos descriptivos que se utilizan en la interfaz de la app
function DBEtiqueta() {
    var modeloEtiqueta = require('../modelos/Etiqueta');
    // referencia privada a la respuesta HTTP
    var response;
    
    // Adiciona un nuevo texto a la collección de etiquetas
    this.crearEtiqqueta = function (reqEtiqueta, res) {
        response = res;
        var nuevaEtiqueta = new modeloEtiqueta(reqEtiqueta.body);
        nuevaEtiqueta.save(onEtiquetaGuardada);
    }
    
    // resultado de guardar una etiqueta
    function onEtiquetaGuardada(err, etiquetaGuardada) {
        if (err) return response.send(err);
        response.send({ message: 'OK, etiqueta adicionada', _id: etiquetaGuardada._id });
    }
    
    this.consultarEtiqueta = function (pNombre, onEtiquetaEncontrada) {
        modeloEtiqueta.findOne({ nombre: pNombre }, 'esCO', onEtiquetaEncontrada);
    }
    
}

module.exports = DBEtiqueta;
