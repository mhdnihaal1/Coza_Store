const mongoose = require('mongoose');

const userschema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    }, 
//    image:{
//     type:String,
//     required:true 
//    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        default :0
    },
    is_verified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    },is_Blocked:{
        type:Boolean,
        default:false
    }
   

});
module.exports = mongoose.model('user',userschema)