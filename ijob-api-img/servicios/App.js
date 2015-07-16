var express = require('express')
var app = express()
//var gfs = require('../datos/DBImagen');


var mongo = require('mongodb');
var Grid = require('gridfs-stream');

// create or use an existing mongodb-native db instance. 
// for this example we'll just create one: 
var db = new mongo.Db('ijobi', new mongo.Server("137.135.103.190", 27017));

// make sure the db instance is open before passing into `Grid` 
db.open(function (err) {
    if (err) return handleError(err);
 
	 db.authenticate('img_api_user', '1m9Us3r*', function(err, res) {
	     if (err) return handleError(err);
	});
  // all set! 
})

var handleError = function (err) {
    console.log(err);
}

app.get('/img/usuarios/imagen/:idImagen', function (req, res) {
    // res.send('Hello World')
    
    var gfs = Grid(db, mongo);
    
    // streaming from gridfs 
    var readstream = gfs.createReadStream({
        _id: req.params.idImagen
    });
    
    //error handling, e.g. file does not exist 
    readstream.on('error', function (err) {
        console.log('An error occurred!', err);
        throw err;
    });
    
    readstream.pipe(res);

});

app.get('/img/usuarios/all/', function (req, res) {
    
    var findDocuments = function (db, callback) {        
        var collection = db.collection('fs.files');        
        // Get the documents collection 
        var files = collection.find({ "contentType" : "binary/octet-stream" }, { filename: 1 , length: 1 })
        .toArray(function (err, docs) {
            // assert.equal(err, null);
            // assert.equal(2, docs.length);
            console.log("Found the following records");
            console.dir(docs);
            callback(docs);
        });
    }
    
    var callback = function (data) {
        var i = 0;
        res.json(data);
    }
    
    findDocuments(db, callback);
});

// prueba imagenes usuarios
app.get('/img/usuarios/prueba/', function (req, res) {
    res.sendfile("./vistas/usuarios.html");
});

module.exports = app;
