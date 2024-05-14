const mongoose = require('mongoose');


const productschema = new mongoose.Schema({

    productName:{
        type:String,
        required:true
    },
    productPrice:{
        type:String,
        required:true
    },
    productQuantity:{
        type:Number,
        required:true
    },
    productDescription:{
        type:String,
        required:true
    },
    productDetails:{
        type:String,
        required:true
    },   
    productCategory:{
        type:String,
        required:true
    },  
    productImage:[{
        type:String,
        required:true
    }],
    // productdiscount:{
    //   type:String,
    //   required:true
    // },
    is_Listed:{
        type:Boolean,
        default:false
    },
    offerDetails:[{
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
         offerId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'offer',
            required:true
         }
    }],
    discount:[{
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
         discountId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'discount',
            required:true
         }
    }]
},{timestamps:true});
module.exports = mongoose.model('product',productschema)