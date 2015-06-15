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
    
    var Cifrador = require('../seguridad/Cifrador');
    var cifrador = new Cifrador();
    
    var DBEtiqueta = require('./DBEtiqueta');
    var dbEtiqueta = new DBEtiqueta();
    
    var DBSector = require('./DBSector');
    var dbSector = new DBSector();
    
    var async = require('async');
    
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
    
    // nivel de estudios 1: bachiller, 2:técnico, 3:tecnológico, 4:profesional, 5:posgrado
    var NivelesEstudios = function () {
        return {
            'Medio': 1,
            'Técnico': 2,
            'Tecnológico': 3,
            'Profesional': 4,
            'Posgrado': 5
        };
    }();
    this.niveles = NivelesEstudios;
    
    // genero 1:Masculino , 2:Femenino
    var Generos = function () {
        return {
            'Masculino': 1,
            'Femenino': 2
        };
    }();
    this.generos = Generos;
    
    // retorna la información de un usuario
    this.consultarUsuario = function (idUsuario, res) {
        response = res;
        var Ubicacion = mongoose.model('Ubicacion');
        var Ocupacion = mongoose.model('Ocupacion');
        modeloUsuario
        .findById(idUsuario)
        .select('nombre apellidos nacimiento genero correo cedula estado _ocupaciones experiencia nivel cursos actividades _ubicacion mostrarCorreo mostrarTelefono mostrarAPP direccion telefono')
        .populate('_ocupaciones _ubicacion')
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
        var nuevoUsuario = new modeloUsuario();
        nuevoUsuario.nombre = reqUsuario.nombre;
        nuevoUsuario.apellidos = reqUsuario.apellidos;
        nuevoUsuario.nacimiento = reqUsuario.nacimiento;
        nuevoUsuario.genero = reqUsuario.genero;
        nuevoUsuario.correo = reqUsuario.correo;
        nuevoUsuario.clave = reqUsuario.clave;
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
            response.send({ message: 'OK, usuario adicionado', _id: usuarioGuardado._id });
        });
    }
    
    var nombreArchivoImagen;
    // actualiza la foto de perfil de un usuario
    this.actualizarImagen = function (_idUsuario, nombreArchivo, res) {
        response = res;
        nombreArchivoImagen = nombreArchivo;
        modeloUsuario.findById(_idUsuario, 'correo _imagen', function onUsuarioImagenEncontrado(err, usuarioEncontrado) {
            if (err) return response.send(err);
            if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
            // sube la imagen a la bd de imagenes y actualiza el usuario
            dbImagen.subirImagenUsuario(usuarioEncontrado, nombreArchivoImagen, response);
        });
    }
    
    var informacionUsuario;
    // Actualiza la informacion personal de un usuario
    this.actualizarInformacion = function (_idUsuario, reqUsuario, res) {
        response = res;
        informacionUsuario = reqUsuario;
        modeloUsuario.findById(_idUsuario, onActualizarInformacionEncontrado);
    }
    
    // encuentra un usuario en la BD con el id, actualiza su informacion personal
    function onActualizarInformacionEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
        
        usuarioEncontrado.nombre = informacionUsuario.nombre;
        usuarioEncontrado.apellidos = informacionUsuario.apellidos;
        usuarioEncontrado.nacimiento = informacionUsuario.nacimiento;
        usuarioEncontrado.genero = informacionUsuario.genero;
        usuarioEncontrado.correo = informacionUsuario.correo;
        usuarioEncontrado.cedula = informacionUsuario.cedula;
        usuarioEncontrado.estado = EstadosUsuario.Completado;
        usuarioEncontrado.activo = true;
        usuarioEncontrado.modificado = Date.now();
        usuarioEncontrado.save(function onActualizarUsuarioGuardado(err, usuarioGuardado) {
            if (err) return response.send(err);
            // Actualiza un usuario satisfatoriamente
            response.send({ message: 'OK, usuario actualizado', _id: usuarioGuardado._id });
        });
    }
    
    // valor local de la ubicacion del usuario
    var ocupacionUsuario;
    var ocupacionesUsuario;
    // actualizar ocupaciones, utiliza la libreria async para realizar la
    // actualización de las ocupaciones al mismo tiempo.
    this.actualizarOcupacion = function (_idUsuario, reqOcupacion, res) {
        response = res;
        ocupacionUsuario = reqOcupacion;
        ocupacionUsuario._id = _idUsuario;
        ocupacionesUsuario = [];
        
        async.parallel([
            function (cb) { dbSector.consultarID(reqOcupacion.principal, cb); },
            function (cb) { dbSector.consultarID(reqOcupacion.secundaria, cb); }
        ], function (err, result) {
            ocupacionesUsuario[0] = result[0];
            ocupacionesUsuario[1] = result[1];
            var Ocupacion = mongoose.model('Ocupacion');
            modeloUsuario.findById(ocupacionUsuario._id, '_ocupaciones experiencia nivel cursos actividades', onActualizarOcupacionEncontrado);
        });
    }
    
    function onActualizarOcupacionEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
        
        usuarioEncontrado._ocupaciones = ocupacionesUsuario;
        usuarioEncontrado.experiencia = ocupacionUsuario.experiencia;
        usuarioEncontrado.nivel = ocupacionUsuario.nivel;
        usuarioEncontrado.cursos = ocupacionUsuario.cursos;
        usuarioEncontrado.actividades = ocupacionUsuario.actividades;
        // a partir de este momento el usuario ya aparece en las búsquedas
        usuarioEncontrado.estado = EstadosUsuario.Disponible;
        usuarioEncontrado.activo = true;
        usuarioEncontrado.modificado = Date.now();
        usuarioEncontrado.save(function onUsuarioActualizado(err, usuarioGuardado) {
            if (err) return response.send(err);
            response.send({ message: 'OK, usuario actualizado', _id: usuarioGuardado._id });
        });
    }    
    
    // valor local de la ubicacion del usuario
    var ubicacionUsuario;
    // actualizar ocupaciones
    this.actualizarUbicacion = function (_idUsuario, reqUbicacion, res) {
        response = res;
        ubicacionUsuario = reqUbicacion;
        var Sector = mongoose.model('Sector');
        modeloUsuario.findById(_idUsuario, '_ubicacion mostrarCorreo mostrarTelefono mostrarAPP direccion', onActualizarUbicacionEncontrado);
    }
    // si encontro el usuario, actualiza su ubicacion
    function onActualizarUbicacionEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) response.send({ 'Error': 'Usuario no encontrado' });
        
        usuarioEncontrado._ubicacion = ubicacionUsuario._ubicacion;
        usuarioEncontrado.telefono = ubicacionUsuario.telefono;
        usuarioEncontrado.mostrarCorreo = ubicacionUsuario.mostrarCorreo;
        usuarioEncontrado.mostrarTelefono = ubicacionUsuario.mostrarTelefono;
        usuarioEncontrado.mostrarAPP = ubicacionUsuario.mostrarAPP;
        usuarioEncontrado.direccion = ubicacionUsuario.direccion;
        // a partir de este momento el usuario ya aparece en las búsquedas
        usuarioEncontrado.activo = true;
        usuarioEncontrado.modificado = Date.now();
        usuarioEncontrado.save(function onUsuarioActualizado(err, usuarioGuardado) {
            if (err) return response.send(err);
            response.send({ message: 'OK, usuario actualizado', _id: usuarioGuardado._id });
        });
    }
    
    // valor local de la clave del usuario
    var nuevaClaveUsuario;
    // actualizar
    this.actualizarClave = function (_idUsuario, reqClave, res) {
        response = res;
        nuevaClaveUsuario = reqClave.clave;
        modeloUsuario.findById(_idUsuario, 'token clave', onActualizarClaveEncontrado);
    }
    // si encontro el usuario, actualiza su clave y le genera un nuevo token de acceso
    function onActualizarClaveEncontrado(err, usuarioEncontrado) {
        if (err) return response.send(err);
        if (!usuarioEncontrado) return response.send({ 'Error': 'Usuario no encontrado' });
        
        usuarioEncontrado.token = uuid.v1();
        usuarioEncontrado.clave = nuevaClaveUsuario;
        usuarioEncontrado.activo = true;
        usuarioEncontrado.modificado = Date.now();
        usuarioEncontrado.save(function onUsuarioActualizado(err, usuarioGuardado) {
            if (err) return response.send(err);
            response.send({ message: 'OK, usuario actualizado', token: usuarioGuardado.token });
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
        // genera una clave aleatoria y la codifica
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
