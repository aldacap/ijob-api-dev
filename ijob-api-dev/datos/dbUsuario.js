/*
 * CRUD para los usuarios, realiza todas las operaciones sobre la BD
 */

function DBUsuario() {
    var modeloUbicacion = require('../modelos/Ubicacion');
    var modeloUsuario = require('../modelos/Usuario');
    var mongoose = require('mongoose');
    var smptMailer = require('./SMTPMailer.js');
    var mailer = new smptMailer();
    // modulo para generar los tokens
    var uuid = require('uuid');
    // referencia privada a la respuesta HTTP
    var response;
    var DBImagen = require('../datos/DBImagen');
    var dbImagen = new DBImagen();
    
    var Cifrador = require('../seguridad/Cifrador.js');
    var cifrador = new Cifrador();
    
    //var modeloUbicacion = require('./Ubicacion');
    
    // retorna la información de un usuario
    this.consultarUsuario = function (idUsuario, res) {
        response = res;
        var Ubicacion = mongoose.model('Ubicacion');
        modeloUsuario
        .findById(idUsuario)
        .select('correo nombre apellidos cedula genero nacimiento ocupaciones calificacion admin _ubicacion')
        .populate('_ubicacion')
        .exec(onEndConsultarUsuario);
    }
    
    // retorna el usuario encontrado en formato json
    function onEndConsultarUsuario(err, usuarioEncontrado) {
        if (err) return response.send(err);
        response.json(usuarioEncontrado);
    }
    
    //  Entrada al sistema, debe ser el primer metodo que se utiliza para solicitar acceso
    this.autenticarUsuario = function (parametroCorreo, parametroClave, res) {
        response = res;
        modeloUsuario.findOne({ correo: parametroCorreo , clave: parametroClave }, 'nombre apellidos token estado', onUsuarioEncontrado);
    }
    
    // retorna el usuario encontrado en formato json
    function onUsuarioEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        response.json(usuarioEncontrado);
    }
    
    var callbackDone;
    //  Valida el token de un usuario, utilidad para los métodos rivados
    this.validarUsuario = function (parametroToken, done) {
        callbackDone = done;
        modeloUsuario.findOne({ token: parametroToken }, 'nombre apellidos correo', onUsuarioValidado);
    }
    
    // retorna la respuesta
    function onUsuarioValidado(err, usuarioEncontrado) {
        if (err) return callbackDone(err);
        if (!usuarioEncontrado) { return callbackDone(null, false); }
        return callbackDone(null, usuarioEncontrado, { scope: 'all' });
    }
    
    // Adiciona un nuevo usuario al sistema
    this.registrarUsuario = function (reqUsuario, res) {
        response = res;
        // instancia un usuario con los datos que vienen en el request
        var nuevoUsuario = new modeloUsuario(reqUsuario.body);
        // asigna un token de seguridad para la autenticación
        nuevoUsuario.token = uuid.v1();
        nuevoUsuario.admin = false;
        nuevoUsuario.activo = true;
        nuevoUsuario.creado = Date.now();
        // el estado inicial de un usuario es registrado: 1
        nuevoUsuario.estado = 1;
        nuevoUsuario.save(onUsuarioGuardado);
    }
    
    // resultado de guardar un usuario
    function onUsuarioGuardado(err, usuarioGuardado) {
        if (err) return response.send(err);
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
        modeloUsuario.findById(_idUsuario, 'correo ocupaciones', onUsuarioEncontradoPorID);
    }
    
    function onUsuarioEncontradoPorID(err, usuarioEncontrado) {
        if (err) return response.send(err);
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
        
        usuarioEncontrado.save(function onUsuarioActualizado(err, usuarioActualizado) {
            if (err) return response.send(err);
            response.json(usuarioActualizado);
        });
    }
    
    // envia un correo con la clave a un usuario registrado
    this.recordarClave = function (parametroCorreo, res) {
        response = res;
        modeloUsuario.findOne({ correo: parametroCorreo }, 'correo clave', onUsuarioRecordarEncontrado);
    }
    
    // retorna el usuario encontrado en formato json
    function onUsuarioRecordarEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
        var mensajeRecordarClave = 'Te estamos enviando este correo en respuesta a tu solicitud:<br/>Tu clave es: <strong>{0}</strong>';
        
        var nuevaClave = "textoPlano";
        var hashClave = cifrador.hash(nuevaClave);
        
       // var clavePlana = cifrador.descifrar(usuarioEncontrado.clave);
        mailer.enviarCorreo(usuarioEncontrado.correo, 'Clave IJob', hashClave, mensajeRecordarClave.replace('{0}', hashClave));
        response.json({ 'Mensaje': 'Clave enviada' });
    }
    
    var nombreArchivoImagen;
    // actualiza la foto de perfil de un usuario
    this.actualizarImagen = function (_idUsuario, nombreArchivo, res) {
        response = res;
        nombreArchivoImagen = nombreArchivo;
        modeloUsuario.findById(_idUsuario, 'correo _imagen', onUsuarioImagenEncontrado);
    }
    
    function onUsuarioImagenEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
        // sube la imagen a la bd de imagenes y actualiza el usuario
        dbImagen.subirImagenUsuario(usuarioEncontrado, nombreArchivoImagen, response);
    }
    
    // actualiza la foto de perfil de un usuario
    this.consultarImagen = function (_idUsuario, res) {
        response = res;
        modeloUsuario.findById(_idUsuario, 'correo _imagen', onConsultarImagenEncontrado);
    }
    
    function onConsultarImagenEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
        dbImagen.consultarImagen(usuarioEncontrado._imagen, response);
    }
    
    var usuarioActualizar;
    // Actualiza un usuario
    this.actualizarUsuario = function (_idUsuario, reqUsuario, res) {
        response = res;
        usuarioActualizar = reqUsuario;
        modeloUsuario.findById(_idUsuario, onActualizarUsuarioEncontrado);
    }
    // encuentra un usuario en la BD con el id 
    function onActualizarUsuarioEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
        for (var field in usuarioActualizar) {
            usuarioEncontrado[field] = usuarioActualizar[field];
            if (field === 'clave') {
                usuarioEncontrado.token = uuid.v1();
            }
        }
        usuarioEncontrado.activo = true;
        usuarioEncontrado.modificado = Date.now();
        usuarioEncontrado.save(onActualizarUsuarioGuardado);
    }
    // Actualiza un usuario satisfatoriamente
    function onActualizarUsuarioGuardado(err, usuarioGuardado) {
        if (err) return response.send(err);
        response.send({ message: 'OK, usuario actualizado', _id: usuarioGuardado._id });
    }
}

module.exports = DBUsuario;
