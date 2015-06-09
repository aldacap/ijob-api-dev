// herramienta para encriptar y desencriptar datos, usu el proyecto slowAES

function Cifrador() {
    var crypto = require('crypto');
    
    // Frase de encriptación
    //var strEncryptKey = "Secret Passphrase";
    var iv = "1234567890123456";
    this.hash = function (textoPlano) {
        var shasum = crypto.createHash('sha1');
        shasum.update(iv + textoPlano + iv);
        return shasum.digest('hex');
    }
    
    
    this.random = function (howMany, chars) {
        chars = chars 
        || "48CD3F6H1JKLMNOP9R27UWXY5";
        var rnd = crypto.randomBytes(howMany);
        var value = new Array(howMany);
        var len = chars.length;
        
        for (var i = 0; i < howMany; i++) {
            value[i] = chars[rnd[i] % len]
        }        ;
        
        return value.join('');
    }

}
module.exports = Cifrador;
