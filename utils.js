var crypto = require('crypto');
global.cipher = function(val, key){
  var encrypted = "";
  var cip = crypto.createCipher('blowfish', key);
  encrypted += cip.update(val, 'binary', 'hex');
  encrypted += cip.final('hex');
  return encrypted;
}

global.decipher = function(val, key){
  var decrypted = "";
  var decipher = crypto.createDecipher('blowfish', key);
  decrypted += decipher.update(val, 'hex', 'binary');
  decrypted += decipher.final('binary');
  return decrypted;
}
