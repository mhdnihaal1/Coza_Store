const mongoose = require('mongoose');

const Addressschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
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
        official: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Address', Addressschema);
