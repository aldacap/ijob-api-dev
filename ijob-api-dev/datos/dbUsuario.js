/*
 * CRUD para los usuarios, realiza todas las operaciones sobre la BD
 */

function DBUsuario() {
    var modeloUsuario = require('../modelos/Usuario');
    // modulo para generar los tokens
    var uuid = require('uuid');
    // referencia privada a la respuesta HTTP
    var response;
    //  Entrada al sistema, debe ser el primer metodo que se utiliza para solicitar acceso
    this.autenticarUsuario = function (parametroCorreo, parametroClave, res) {
        response = res;
        modeloUsuario.findOne({ correo: parametroCorreo , clave: parametroClave }, 'nombre apellidos token', onUsuarioEncontrado);
    }
    
    // retorna el usuario encontrado en formato json
    function onUsuarioEncontrado(err, usuarioEncontrado) {
        if (err) { return response.send(err); }
        response.json(usuarioEncontrado);
    }
    
    //  Valida el token de un usuario
    this.validarUsuario = function (parametroToken, done) {
        modeloUsuario.findOne({ token: parametroToken }, onUsuarioValidado);
    }
    
    // retorna la respuesta
    function onUsuarioValidado(err, usuarioEncontrado) {
        if (err) { return done(err); }
        if (!usuarioEncontrado) { return done(null, false); }
        return done(null, usuarioEncontrado, { scope: 'all' });
    }
    
    // Adiciona un nuevo usuario al sistema
    this.registrarUsuario = function (reqUsuario, res) {
        response = res;
        // instancia un usuario con los datos que vienen en el request
        var nuevoUsuario = new modeloUsuario(reqUsuario.body);
        // asigna un token de seguridad para la autenticación
        nuevoUsuario.token = uuid.v1();
        nuevoUsuario.save(onUsuarioGuardado);
    }
    
    // resultado de guardar un usuario
    function onUsuarioGuardado(err, usuarioGuardado) {
        if (err) {
            return response.send(err);
        }
        response.send({ message: 'OK, usuario adicionado', _id: usuarioGuardado._id });
    }
}

module.exports = DBUsuario;
