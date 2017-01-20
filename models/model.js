var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('./models');
var db = require('../config/db');
mongoose.connect(db);
mongoose.model('User',new Schema(models.User));
mongoose.model('Template',new Schema(models.Template));
global.Model = function(type){
    return mongoose.model(type);
}
