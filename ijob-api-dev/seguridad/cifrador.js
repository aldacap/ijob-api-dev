// herramienta para encriptar y desencriptar datos, usu el proyecto slowAES

function Cifrador() {
    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');
    // Frase de encriptación
    //var strEncryptKey = "Secret Passphrase";
    var iv = "1234567890123456";
    this.hash = function (textoPlano) {
        shasum.update(iv + textoPlano + iv);
        return shasum.digest('hex');
    }
}
module.exports = Cifrador;
