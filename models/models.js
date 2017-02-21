var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
module.exports = {
  User: {
    username:{ type:String, required:true },
    password:{ type:String, required:true }
  },

  Template: {
    userId: { type:ObjectId, ref:'User' },
    createAt: { type:Date, default:Date.now },
    activity: { type:Object },
    products: { type:Array },
    modelType: { type:String },
    status: {type: Number,default: 1}
  }
}
