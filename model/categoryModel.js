const mongoose = require('mongoose');

const categoryschema = new mongoose.Schema({

    category:{
        type:String,
        required:true
    },
    is_Listed:{
        type:Boolean,
        default:false
    }
});
module.exports = mongoose.model('category',categoryschema)