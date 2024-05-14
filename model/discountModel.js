const mongoose = require('mongoose');


const discountschema = new mongoose.Schema({


    discountPrice:{
        type:Number,
        required:true
    },
   
    discountStarted:{
        type:Date,
        default:Date.now(),
      //  required:true
     },
     discountEnd:{
        type:Date,
        default:0,
      //  required:true
     },


});
module.exports = mongoose.model('discount',discountschema)
