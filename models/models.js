var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
module.exports = {
    Template:{
        title:{type:String,required:true},
        content:{type:String,required:true}
    }
}