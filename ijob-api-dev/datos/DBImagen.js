// Imagenes almacenadas en la bd, a diferecia de los otros modelos, este no necesita un eschema
function DBImagen() {
    
    var mongoose = require('mongoose');
    // Cliente de imagenes,se utiliza una bd diferente por desempeño y modificabilidad
    var cliente = require('./ClienteImagenes.js');
    var Schema = mongoose.Schema;
    
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
    
    var fs = require('fs');
    // referencia privada a la respuesta HTTP
    var response;
    var gfs;
    
    // redimensiona las imágenes
    var Jimp = require("jimp");
    
    var MAX_WIDTH = 640;
    var MAX_HEIGHT = 480;
    
    var strArchivoOriginal = "";
    var strArchivoRecortado = "";
    
    var writeStream;
    
    // Carga un archivo desde la carpeta uploads
    this.subirImagen = function (nombreArchivo, res) {
        response = res;
        gfs = Grid(cliente.db);
        // streaming to gridfs
        // filename to store in mongodb
        writeStream = gfs.createWriteStream({
            filename: nombreArchivo
        });
        
        strArchivoOriginal = './uploads/' + nombreArchivo;
        strArchivoRecortado = './resizes/' + nombreArchivo;
        
        // abre el archivo subido
        var img = new Jimp('./uploads/' + nombreArchivo, onEndArchivoOriginalCargado);
    }
    
    function onEndArchivoOriginalCargado(err, image) {
        
        var width = image.bitmap.width; // the width of the image
        var height = image.bitmap.height// the height of the image
        
        var newWidth = width;
        var newHeight = height;
        
        if (width > MAX_WIDTH) {
            var ratio = width / MAX_WIDTH;
            newWidth = MAX_WIDTH;
            newHeight = height / ratio;
        }
        
        if (newHeight > MAX_HEIGHT) {
            var ratio = newHeight / MAX_HEIGHT;
            newHeight = MAX_HEIGHT;
            newWidth = newWidth / ratio;
        }
        
        image.resize(newWidth, newHeight, onEndArchivoRecortado);
    }
    
    function onEndArchivoRecortado(err, img) {
        img.write(strArchivoRecortado , onEndWriteArchivoRecortado);
    }
    
    function onEndWriteArchivoRecortado(err, img) {
        //console.log(b);                    
        fs.createReadStream(strArchivoRecortado).pipe(writeStream);
        // cuando termina de subir el archivo, lo borra y retorna el id
        writeStream.on('close', onEndSubirImagen);
    }
    
    // termino de subir el archivo a la bd
    function onEndSubirImagen(file) {
        // elimina el archivo que ya se subio
        fs.unlink(strArchivoOriginal, function (err) {
            if (err) response.send(err);
            //return response.send(file);
            
            fs.unlink(strArchivoRecortado, function (err) {
                if (err) response.send(err);
                return response.send(file);
            });
        });
    }
    
    // obtiene el archivo de una imagen por su ID
    this.consultarImagen = function (idArchivo, res) {
        response = res;
        
        if (idArchivo) {
            var Grid = require('gridfs-stream');
            Grid.mongo = mongoose.mongo;
            gfs = Grid(cliente.db);
            // Valida que exista el archivo
            gfs.findOne({ _id: idArchivo }, onEncontrarImagen);
        }
        else {
            res.statusCode = 404;
            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            res.send({ message: 'Error, imágen no encontrada' });
        }
    }
    
    // si encuentra el arhivo, lo envia en el response
    function onEncontrarImagen(err, imagenEncontrada) {
        if (err) response.send(err);
        if (imagenEncontrada) {
            var readstream = gfs.createReadStream({
                _id: imagenEncontrada._id
            });
            readstream.pipe(response);
        }
        else {
            res.statusCode = 404;
            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            res.send({ message: 'Error, imágen no encontrada' });
        }
    }
    
    // Objeto Mongoose del usuario al que se le actualiza la imagen
    var usuarioImagen;
    // Carga un archivo desde la carpeta uploads
    this.subirImagenUsuario = function (usuario, nombreArchivo, res) {
        response = res;
        // idUsuario = _idUsuario;        
        usuarioImagen = usuario;
        gfs = Grid(cliente.db);
        //// streaming to gridfs, filename to store in mongodb
        //var writestream = gfs.createWriteStream({ filename: nombreArchivo });
        //fs.createReadStream('./uploads/' + nombreArchivo).pipe(writestream);
        //// cuando termina de subir el archivo, lo borra y retorna el id
        //writestream.on('close', onEndSubirImagenUsuario);
        
        writeStream = gfs.createWriteStream({
            filename: nombreArchivo
        });
        
        strArchivoOriginal = './uploads/' + nombreArchivo;
        strArchivoRecortado = './resizes/' + nombreArchivo;
        
        // abre el archivo subido
        var img = new Jimp(strArchivoOriginal, onEndUsuarioArchivoOriginalCargado);
    }
    
    function onEndUsuarioArchivoOriginalCargado(err, image) {
        
        var width = image.bitmap.width; // the width of the image
        var height = image.bitmap.height// the height of the image
        
        var newWidth = width;
        var newHeight = height;
        
        if (width > MAX_WIDTH) {
            var ratio = width / MAX_WIDTH;
            newWidth = MAX_WIDTH;
            newHeight = height / ratio;
        }
        
        if (newHeight > MAX_HEIGHT) {
            var ratio = newHeight / MAX_HEIGHT;
            newHeight = MAX_HEIGHT;
            newWidth = newWidth / ratio;
        }
        
        image.resize(newWidth, newHeight, function onEndUsuarioArchivoRecortado(err, img) {
            img.write(strArchivoRecortado , onEndUsuarioWriteArchivoRecortado);
        });
    }
    
    function onEndUsuarioWriteArchivoRecortado(err, img) {
        //console.log(b);                    
        fs.createReadStream(strArchivoRecortado).pipe(writeStream);
        // cuando termina de subir el archivo, lo borra y retorna el id
        writeStream.on('close', onEndUsuarioSubirImagen);
    }
    
    // termino de subir el archivo a la bd
    function onEndUsuarioSubirImagen(file) {
        // elimina el archivo que ya se subio
        fs.unlink(strArchivoOriginal, function (err) {
            if (err) response.send(err);
            //return response.send(file);
            
            fs.unlink(strArchivoRecortado, function (err) {
                if (err) response.send(err);
                //return response.send(file);
                
                // actualiza el usuario que se paso por referencia
                usuarioImagen._imagen = file._id;
                usuarioImagen.save(function onUsuarioActualizado(err, usuarioActualizado) {
                    if (err) return response.send(err);
                    response.json(usuarioActualizado);
                });

            });
        });
    }

    //// termino de subir el archivo a la bd
    //function onEndSubirImagenUsuario(file) {
    //    // elimina el archivo que ya se subio
    //    fs.unlink('./uploads/' + file.filename, function (err) {
    //        if (err) response.send(err);
    //        // actualiza el usuario que se paso por referencia
    //        usuarioImagen._imagen = file._id;
    //        usuarioImagen.save(function onUsuarioActualizado(err, usuarioActualizado) {
    //            if (err) return response.send(err);
    //            response.json(usuarioActualizado);
    //        });
    //    });
    //}


}

module.exports = DBImagen;
