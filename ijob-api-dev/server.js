/**
 * applicación de servicios rest
 */
var app = require('./servicios/app');

app.set('port', process.env.PORT || 8000);

// página de inicio, no contiene ninguna información
app.get('/', function (req, res) {
    res.send('K1 Restful API </br>"api/usuarios"');
    //res.send('iniciar - sesion: { @correo, @clave}');
});

var server = app.listen(app.get('port'), function () {
    console.log('Servidor Express escuchando en el puerto ' + server.address().port);
});
