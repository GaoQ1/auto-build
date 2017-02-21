var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('./models');

//mongoose 分页插件  https://github.com/edwardhotchkiss/mongoose-paginate
var mongoosePaginate = require('mongoose-paginate');
var templateSchema =  new Schema(models.Template);
templateSchema.plugin(mongoosePaginate);
var db = require('../config/db');
mongoose.connect(db);
mongoose.model('User',new Schema(models.User));
mongoose.model('Template',templateSchema);
global.Model = function(type){
    return mongoose.model(type);
}
