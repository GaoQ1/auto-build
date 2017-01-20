var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
module.exports = {
  User: {
    username:{ type:String, required:true },
    password:{ type:String, required:true }
  },

  Template: {
    userId: { type:ObjectId, ref:'User' },
    activityName: { type:String },
    pageTitle: { type:String },
    productName: { type:String },
    productPrice: { type:String },
    createAt: { type:Date, default:Date.now },
    modelType: { type:String }
  }
}
