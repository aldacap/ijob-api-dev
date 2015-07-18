
var Mailer = function () {
    var modeloAuditoria = require('../modelos/Auditoria');
    var audit = new modeloAuditoria();
    var nodemailer = require('nodemailer');
    var fs = require('fs');
    var path = require('path');
    // carga la cadena de conexión del archivo de configuración
    var config = require('../config.json');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.SMTPUser,
            pass: config.SMTPPass
        }
    });
    
    this.enviarCorreo = function (to, asunto, mensajePlano, mensajeHTML) {
        transporter.sendMail({
            from: 'IJob <ijob.com.co@gmail.com>',
            to: to,
            subject: asunto,
            text: mensajePlano,
            html: mensajeHTML
        });
    }
    
    this.leerArchivo = function (strNombreArchivo, cb) {
        var strRuta = path.join('./vistas/' , strNombreArchivo);
        fs.readFile(strRuta, 'utf8', cb);
    }
    
    var onEndLeerArchivo = function (err, data) {
        if (err) {
            var descripcion = err.toString();
            audit.fecha = new Date();
            audit.metodo = 'consultarID';
            audit.descripcion = descripcion;
            audit.save();
            return console.log(err);
        }
        console.log(data);
    };
}

module.exports = Mailer;