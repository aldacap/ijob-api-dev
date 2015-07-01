
var Mailer = function () {
    var nodemailer = require('nodemailer');
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
}

module.exports = Mailer;