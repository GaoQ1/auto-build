global.md5 = function(val){
    return require('crypto').createHash('md5').update(val).digest('hex');
}