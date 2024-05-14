const mongoose = require('mongoose');


const cartschema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    products:[{
        
     productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        required:true
     },
     Quantity:{
        type:Number,
        default:1,
        min:1, 
        max:10
            }
}],

 couponPrice:{
   type:String,
   default:0
            },
 createdAt:{
    type:Date,
    default:Date.now(),
  //  required:true
 },
 updatedAt:{
    type:Date,
    default:Date.now(),
   // required:true
 }

})
module.exports = mongoose.model('cart',cartschema)