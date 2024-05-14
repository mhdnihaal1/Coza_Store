const mongoose = require('mongoose');


const couponschema = new mongoose.Schema({


    couponCode:{
        type:String,
        required:true
    },
    couponPrice:{
        type:Number,
        required:true
    },
    minimumPurchaseAmount:{
        type:Number,
        required:true
    },
    couponStarted:{
        type:Date,
        default:Date.now(),
      //  required:true
     },
     couponEnd:{
        type:Date,
        default:0,
      //  required:true
     },


});
module.exports = mongoose.model('coupon',couponschema)
