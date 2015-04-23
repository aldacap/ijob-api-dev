/*
 * CRUD para los usuarios
 */

function dbUsuario() {
    var usuario = require('../modelos/usuario');
    
    this.autenticar = function (correo, clave, response) {
        //var usuario = require('../modelos/usuario');
        usuario.findOne({ correo: correo , clave: clave }, 'nombre apellidos token', function (err, usuario) {
            
            if (err) { return response.send(err); }
            response.json(usuario);
        //return usuario;
        });
    }
}

//dbUsuario.prototype.
//};

module.exports = dbUsuario;
