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
        nuevoUsuario.admin = false;
        nuevoUsuario.save(onUsuarioGuardado);
    }
    
    // resultado de guardar un usuario
    function onUsuarioGuardado(err, usuarioGuardado) {
        if (err) {
            return response.send(err);
        }
        response.send({ message: 'OK, usuario adicionado', _id: usuarioGuardado._id });
    }
    
    // valor local de la ocupacion principal
    var ocupacion;
    var indiceOcupacion;
    // actualizar ocupaciones
    this.actualizarOcupacion = function (esPrincipal, _idUsuario, reqOcupacion, res) {
        response = res;
        ocupacion = reqOcupacion;
        // inicializa el indice de la aplicación, es 0 o 1
        indiceOcupacion = esPrincipal ? 0:1;
        modeloUsuario.findById(_idUsuario, onUsuarioEncontradoPorID);
    }
    
    function onUsuarioEncontradoPorID(err, usuarioEncontrado) {
        if (err) {
            return response.send(err);
        }
        
        // instancia la nueva ocupación
        var nuevaOcupacion = usuarioEncontrado.ocupaciones.create(ocupacion);
        
        // remueve y adiciona el primer item
        if (indiceOcupacion === 0) {
            if (usuarioEncontrado.ocupaciones.length > 0)
                usuarioEncontrado.ocupaciones[0].remove();
            
            usuarioEncontrado.ocupaciones.unshift(nuevaOcupacion);
        } else { 
            // remueve y adiciona el segundo item
            if (usuarioEncontrado.ocupaciones.length > 1)
                usuarioEncontrado.ocupaciones[1].remove();
            usuarioEncontrado.ocupaciones.push(nuevaOcupacion);
        }
        
        //// inicializa un item del array de ocupaciones
        //if (usuarioEncontrado.ocupaciones.length < indiceOcupacion + 1) {
        //    usuarioEncontrado.ocupaciones.push(nuevaOcupacion);
        //} else {
        //    // usuarioEncontrado.ocupaciones[indiceOcupacion].remove();            
        //    usuarioEncontrado.ocupaciones[indiceOcupacion] = nuevaOcupacion;
        //}
        
        usuarioEncontrado.save(function onUsuarioActualizado(err, usuarioActualizado) {
            if (err) return response.send(err);
            response.json(usuarioActualizado);
        });

        //for (prop in ocupacionPrincipal) {
        //    // if (usuario.[prop])
        //    // usuario.[prop] = req.body[prop];
        //    usuarioEncontrado.ocupaciones[0][prop] = ocupacionPrincipal[prop];
        //}
    }
    
    //function handleError(err, data) {
    //    console.log(err);
    //}
}

module.exports = DBUsuario;
