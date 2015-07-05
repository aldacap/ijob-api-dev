/**
 * applicación de servicios rest
 */
var app = require('./servicios/App');
var path = require('path');

// establece los puertos de escucha 
app.set('port', process.env.PORT || 8000);

// página de inicio, no contiene ninguna información
app.get('/api', function onRequest(req, res) {
    res.sendFile(path.join(__dirname , '/vistas/index.html'));
});

var server = app.listen(app.get('port'), function onServerListen() {
    console.log('Servidor Express escuchando en el puerto ' + server.address().port);
});
