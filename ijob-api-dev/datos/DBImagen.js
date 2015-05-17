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
    
    // Carga un archivo desde la carpeta uploads
    this.subirImagen = function (nombreArchivo, res) {
        response = res;
        gfs = Grid(cliente.db);
        // streaming to gridfs
        //filename to store in mongodb
        var writestream = gfs.createWriteStream({
            filename: nombreArchivo
        });
        fs.createReadStream('./uploads/' + nombreArchivo).pipe(writestream);
        // cuando termina de subir el archivo, lo borra y retorna el id
        writestream.on('close', onEndSubirImagen);
    }
    
    // termino de subir el archivo a la bd
    function onEndSubirImagen(file) {
        // elimina el archivo que ya se subio
        fs.unlink('./uploads/' + file.filename, function (err) {
            if (err) response.send(err);
            return response.send(file);
        });
    }
    
    this.consultarImagen = function (idArchivo, res) {
        response = res;
        
        var Grid = require('gridfs-stream');
        Grid.mongo = mongoose.mongo;
        gfs = Grid(cliente.db);
        // Valida que exista el archivo
        gfs.findOne({ _id: idArchivo }, onEncontrarImagen);
    }
    
    // si encuentra el arhivo, lo envia en el response
    function onEncontrarImagen(err, imagenEncontrada) {
        if (err) response.send(err);
        var readstream = gfs.createReadStream({
            _id: imagenEncontrada._id
        });
        readstream.pipe(response);
    }
}

module.exports = DBImagen;
