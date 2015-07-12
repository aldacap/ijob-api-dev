//var mongo = require('mongodb');
//var Grid = require('gridfs-stream');

//// create or use an existing mongodb-native db instance. 
//// for this example we'll just create one: 
//var db = new mongo.Db('ijobi', new mongo.Server("137.135.103.190", 27017));

//var gfs;
//// make sure the db instance is open before passing into `Grid` 
//db.open(function (err) {
//    if (err) return handleError(err);
//    gfs = Grid(db, mongo);
 
//  // all set! 
//})

//var handleError = function (err) {
//    console.log(err);
//}

//module.exports = gfs;