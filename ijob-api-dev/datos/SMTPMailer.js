
var Mailer = function () {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ijob.com.co@gmail.com',
            pass: 'IjobColombia2015*'
        }
    });
    
    this.enviarCorreo = function (to, asunto, mensaje) {
        transporter.sendMail({
            from: 'ijob.com.co@gmail.com',
            to: to,
            subject: asunto,
            text: mensaje
        });
    }
}

module.exports = Mailer;