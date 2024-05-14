const mongoose = require('mongoose');

const walletschema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.ObjectId,
        ref:"user",
        required: true,
      },
      balance: {
        type: String,
        required: true,
        default: 0,
      },
      history: [
        {
          Reason: {
            type: String,
          },
          amount: {
            type: String,
          },
          transaction:{
            type: String,
          },
          date: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
    });
module.exports = mongoose.model('wallet',walletschema)