/**
 * applicación de servicios rest
 */
var app = require('./servicios/App');

// establece los puertos de escucha 
app.set('port', process.env.PORT || 8000);

// página de inicio, no contiene ninguna información
app.get('/', function onRequest(req, res) {
    res.writeHeader(200, { "Content-Type": "text/html" });
    res.write('<div style="padding:20px;margin:20px;font-family: Arial !important;">')
    res.write('<h2>K1 Rest API</h2>')
    res.write('<h3>Damian Del Castillo 2015</h3>')
    res.write('<b>Todos los servicios se encuentran dentro de la ruta /api</b><br />')
    res.write('Usuarios<ul>')
    res.write('<li>get:/autenticar/{usuario}{clave}</li><br />')
    res.write('<li>post:/usuarios/registrar/{nombre}{apellidos}{correo}{cedula}{activo}{direccion}{clave}</li><br />')
    res.write('</ul>')
    res.write('Sectores<ul>')
    res.write('<li>get:/sectores/</li><br />')
    res.write('<li>post:/sectores/{nombre}</li><br />')
    res.write('</ul>')
    res.write('Ocupaciones<ul>')
    res.write('<li>get:/ocupaciones/</li><br />')
    res.write('<li>post:/ocupaciones/{nombre}{descripcion}{_sector}</li><br />')
    res.write('</ul>')
    res.end('<a href="mailto:damiandelcastillo@hotmail.com" >Damian Del Castillo</a>');
    res.write('</div>')
});

var server = app.listen(app.get('port'), function onServerListen() {
    console.log('Servidor Express escuchando en el puerto ' + server.address().port);
});
