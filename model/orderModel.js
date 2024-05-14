const mongoose = require('mongoose');

const orderschema = new mongoose.Schema({

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
                },
         orderStatus:{
            type:String,
            default:'pending'
         }       
         }],
    address: [{
        name: {
            type: String,
            required: true
        },
        mobile: {
            type: Number,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        Housenumber: {
            type: Number,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        landmark: {
            type: String,
            // required: true
        },
        official: [{
            type: String,
            required: true
        }]
    }],
payment:[{
type:String,
default:"pending"

}],
TotalAmount:{
    type:String,
},
couponprice:{
   type:Number
},
 createdAt:{
    type:Date,
    default:Date.now(),
   required:true
 },
 updatedAt:{
    type:Date,
    default:Date.now(),
   required:true
 }

})
module.exports = mongoose.model('order',orderschema)