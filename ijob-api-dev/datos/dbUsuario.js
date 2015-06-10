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
    
    var DBEtiqueta = require('./DBEtiqueta');
    var dbEtiqueta = new DBEtiqueta();
    
    // estados: 1:registrado, 2:confirmado, 3:completado, 4:disponible, 5:no disponible
    var EstadosUsuario = function () {
        return {
            'Registrado': 1,
            'Confirmado': 2,
            'Completado': 3,
            'Disponible': 4,
            'NoDisponible': 5
        };
    }();
    
    this.estados = EstadosUsuario;
    
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
        modeloUsuario.findOne({ token: parametroToken }, 'nombre apellidos correo estado admin', onUsuarioValidado);
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
        nuevoUsuario.estado = EstadosUsuario.Registrado;
        nuevoUsuario.save(onUsuarioGuardado);
    }
    
    // resultado de guardar un usuario
    function onUsuarioGuardado(err, usuarioGuardado) {
        if (err) return response.send(err);
        
        dbEtiqueta.consultarEtiqueta('correo-registrar', function onEtiquetaEncontrada(err, etiquetaEncontrada) {
            if (err) response.json({ 'Mensaje': 'No se encontro el cuerpo del mensaje' });
            var mensajeRegistro = etiquetaEncontrada.esCO.replace('{0}', usuarioGuardado.id);
            mailer.enviarCorreo(usuarioGuardado.correo, 'Bienvenido a IJob', usuarioGuardado.id, mensajeRegistro);
            //response.json({ 'Mensaje': 'Bienvenido enviada' });
            response.send({ message: 'OK, usuario adicionado', _id: usuarioGuardado._id });
        });
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
        
        // a partir de este momento el usuario ya aparece en las búsquedas
        usuarioEncontrado.estado = EstadosUsuario.Disponible;
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
    
    var nuevaClave;
    // busca un usuario con su correo y le genera una clave aleatoria
    function onUsuarioRecordarEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
        
        nuevaClave = cifrador.random(8);
        var hashClave = cifrador.hash(nuevaClave);
        
        usuarioEncontrado.activo = true;
        usuarioEncontrado.modificado = Date.now();
        usuarioEncontrado.clave = hashClave;
        usuarioEncontrado.save(onUsuarioRecordarEncontradoGuardado);
    }
    
    // Consulta el cuerpo de un mensaje en la bd y envía un correo con su nueva clave
    function onUsuarioRecordarEncontradoGuardado(err, usuarioGuardado) {
        if (err) return response.send(err);
        
        dbEtiqueta.consultarEtiqueta('correo-recordar', function onEtiquetaEncontrada(err, etiquetaEncontrada) {
            if (err) response.json({ 'Mensaje': 'No se encontro el cuerpo del mensaje' });
            var mensajeRecordarClave = etiquetaEncontrada.esCO.replace('{0}', usuarioGuardado.correo);
            mensajeRecordarClave = mensajeRecordarClave.replace('{1}', nuevaClave);
            mailer.enviarCorreo(usuarioGuardado.correo, 'Clave IJob', nuevaClave, mensajeRecordarClave);
            response.json({ 'Mensaje': 'Clave enviada' });
        });
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
    
    // encuentra un usuario en la BD con el id, si cambia la clave, se genera un nuevo token
    function onActualizarUsuarioEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
        for (var field in usuarioActualizar) {
            usuarioEncontrado[field] = usuarioActualizar[field];
            if (field === 'clave') {
                if (usuarioEncontrado[field] !== usuarioActualizar[field])
                    usuarioEncontrado.token = uuid.v1();
            }
        }
        
        if (usuarioEncontrado.estado < EstadosUsuario.Completado)
            usuarioEncontrado.estado = EstadosUsuario.Completado;
        
        usuarioEncontrado.activo = true;
        usuarioEncontrado.modificado = Date.now();
        usuarioEncontrado.save(onActualizarUsuarioGuardado);
    }
    // Actualiza un usuario satisfatoriamente
    function onActualizarUsuarioGuardado(err, usuarioGuardado) {
        if (err) return response.send(err);
        response.send({ message: 'OK, usuario actualizado', _id: usuarioGuardado._id });
    }
    
    // Actualiza el estado de un usuario
    this.terminarRegistro = function (_idUsuario, res) {
        response = res;
        modeloUsuario.findById(_idUsuario, onTerminarRegistroEncontrado);
    }
    // encuentra un usuario en la BD con el id 
    function onTerminarRegistroEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
        
        usuarioEncontrado.estado = EstadosUsuario.Confirmado;
        usuarioEncontrado.activo = true;
        usuarioEncontrado.modificado = Date.now();
        usuarioEncontrado.save();
    }
    
    var bolEstadoDisponible;
    // Actualiza el estado de un usuario
    this.cambiarDisponibilidad = function (_idUsuario, bolDisponible, res) {
        response = res;
        bolEstadoDisponible = bolDisponible;
        modeloUsuario.findById(_idUsuario, onCambiarDisponibilidadEncontrado);
    }
    // encuentra un usuario en la BD con el id 
    function onCambiarDisponibilidadEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
        usuarioEncontrado.estado = bolEstadoDisponible ?  EstadosUsuario.Disponible : EstadosUsuario.NoDisponible;
        usuarioEncontrado.activo = true;
        usuarioEncontrado.modificado = Date.now();
        usuarioEncontrado.save();
        response.send({ message: 'OK, Se actualizó la disponibilidad', estado: bolEstadoDisponible ?  'Disponible' : 'NoDisponible' });
    }
}

module.exports = DBUsuario;
