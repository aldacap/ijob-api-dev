// Imagenes almacenadas en la bd, a diferecia de los otros modelos, este no necesita un eschema
function DBImagen() {
    
    var mongoose = require('mongoose');
    // Cliente de imagenes,se utiliza una bd diferente por desempeño y modificabilidad
    var cliente = require('./ClienteImagenes.js');
    var Schema = mongoose.Schema;
    
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
    
    var path = require('path');
    
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
        fs.createReadStream(strArchivoRecortado).pipe(writeStream);
        // cuando termina de subir el archivo, lo borra y retorna el id
        writeStream.on('close', onEndSubirImagen);
    }
    
    // termino de subir el archivo a la bd
    function onEndSubirImagen(file) {
        // elimina el archivo que ya se subio
        fs.unlink(strArchivoOriginal, function (err) {
            if (err) response.send(err);
            fs.unlink(strArchivoRecortado, function (err) {
                if (err) response.send(err);
                return response.send(file);
            });
        });
    }
    
    var imagenEnviada = false;
    // obtiene el archivo de una imagen por su ID
    this.consultarImagen = function (idArchivo, res) {
        response = res;
        imagenEnviada = false;
        if (!idArchivo) {
            enviarImagenError('not-found');
            return;
        }
        
        var Grid = require('gridfs-stream');
        Grid.mongo = mongoose.mongo;
        gfs = Grid(cliente.db);
        // Valida que exista el archivo
        gfs.findOne({ _id: idArchivo }, onEncontrarImagen);
    }
    
    // si encuentra el arhivo, lo envia en el response
    function onEncontrarImagen(err, imagenEncontrada) {
        if (err) {
            enviarImagenError('img-error');
            return;
        }
        
        if (!imagenEncontrada) {
            enviarImagenError('bad-file');
            return;
        }
        
        if (!imagenEnviada) {
            var strMime = "image/";
            var strExt = path.extname(imagenEncontrada.filename).replace('.', '');
            strMime = strExt === 'jpg' ?  strMime + 'jpeg'  : strMime + strExt;
            
            try {
                response.setHeader("Content-Type", strMime);
                response.setHeader("Content-Length", imagenEncontrada.length);
                response.setHeader('Content-Disposition', 'inline; filename="' + imagenEncontrada.filename + '"');
                //response.statusCode = 200;
                
                var readstream = gfs.createReadStream({
                    _id: imagenEncontrada._id
                });
                
                // Add this to ensure that the out.txt's file descriptor is closed in case of error.
                response.on('error', function (err) {
                    readstream.end();
                });
                
                readstream.pipe(response);
                imagenEnviada = true;
            }
            catch (error) {
                console.log(error + ' archivo: ' + imagenEncontrada.filename);
            }

            
        }
       // }
    }
    
    function enviarImagenError(img) {
        if (!imagenEnviada) {
            
            try {
                var strRutaArchivo = path.join(__dirname, '../vistas/imagenes/', img + '.png');
                var stats = fs.statSync(strRutaArchivo);
                var fileSizeInBytes = stats["size"];
                response.setHeader("Content-Type", "image/png");
                response.setHeader("Content-Length", fileSizeInBytes);
                //response.sendFile(strRutaArchivo);
                
                var readStream = fs.createReadStream(filePath);
                // We replaced all the event handlers with a simple call to readStream.pipe()
                readStream.pipe(response);
                
                imagenEnviada = true;
            } 
            catch (error) {
                console.log(error + ' archivo: ' + img);
            }

        }
        //var bitmap = fs.readFileSync(strRutaArchivo);
        //return new Buffer(bitmap).toString('base64');
    }
    
    // Objeto Mongoose del usuario al que se le actualiza la imagen
    var usuarioImagen;
    // Carga un archivo desde la carpeta uploads
    this.subirImagenUsuario = function (usuario, nombreArchivo, res) {
        response = res;
        usuarioImagen = usuario;
        gfs = Grid(cliente.db);
        //// streaming to gridfs, filename to store in mongodb
        //// cuando termina de subir el archivo, lo borra y retorna el id
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
        fs.createReadStream(strArchivoRecortado).pipe(writeStream);
        // cuando termina de subir el archivo, lo borra y retorna el id
        writeStream.on('close', onEndUsuarioSubirImagen);
    }
    
    // termino de subir el archivo a la bd
    function onEndUsuarioSubirImagen(file) {
        // elimina el archivo que ya se subio
        fs.unlink(strArchivoOriginal, function (err) {
            if (err) response.send(err);
            fs.unlink(strArchivoRecortado, function (err) {
                if (err) response.send(err);
                // actualiza el usuario que se paso por referencia
                usuarioImagen._imagen = file._id;
                usuarioImagen.save(function onUsuarioActualizado(err, usuarioActualizado) {
                    if (err) return response.send(err);
                    response.json(usuarioActualizado);
                });

            });
        });
    }
}

module.exports = DBImagen;
