const mongoose = require('mongoose');

const offerschema = new mongoose.Schema({

    offerName:{
        type:String,
        required:true
    },
    offerPrice:{
        type:Number,
        default:0,
      //  required:true
     },
    offerStarted:{
        type:Date,
        default:Date.now(),
      //  required:true
     },
     offerEnd:{
        type:Date,
        default:0,
      //  required:true
     },
});
module.exports = mongoose.model('offer',offerschema)