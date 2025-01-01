const mongoose = require('mongoose');

const transactionModel = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    transactions:[{
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'cancelled'],
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        amount: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        payment_method: {
            type: String,
            required: true,
            // ref: 'PaymentMethod'
        },
        transaction_id: {
            type: String,
            required: true
        },
        payment_method: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Transaction', transactionModel, 'Transactions');
