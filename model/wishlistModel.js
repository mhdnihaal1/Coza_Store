const mongoose= require('mongoose')

const wishlistschema =new mongoose.Schema({

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
         }
    }],

})

module.exports=mongoose.model('wishlist',wishlistschema)