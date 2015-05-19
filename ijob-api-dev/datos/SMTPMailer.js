
var Mailer = function () {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ijob.com.co@gmail.com',
            pass: 'IjobColombia2015*'
        }
    });
    
    this.enviarCorreo = function (to, asunto, mensajePlano,mensajeHTML ) {
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