/*
 * CRUD para los usuarios
 */

function dbUsuario() {
    this.Usuario = require('../modelos/usuario');
}

dbUsuario.prototype.autenticar = function (correo, clave, response) {
    var Usuario = require('../modelos/usuario');
    Usuario.findOne({ correo: correo , clave: clave }, 'nombre apellidos token', function (err, usuario) {
        
        if (err) { return res.send(err); }
        response.json(usuario);

        //return usuario;
    });
};

module.exports = dbUsuario;
