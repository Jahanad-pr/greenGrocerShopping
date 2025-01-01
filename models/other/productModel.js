const { type } = require('express/lib/response');
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    pics: {
        type: Object,
        // required: false,
        default:{
            one:'',
            tow:'',
            three:''
        }
    },
    isListed:{
        type: Boolean
    },
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Categorie'
    },
    productCollection:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true
        ref: 'Collection'
    },
    description:{
        type: String,
        required: true
    },
    regularPrice:{
        type: Number,
        required: true
    },
    salePrice:{
        type: Number,
        required: true
    }
    ,
    stock:{
        type: Number,
        required: true
    },
    freshness:{
        type: String,
        required: true
    },
    harvestedTime:{
        type: Date,
        required: true
    },
    from:{
        type: String,
        required: true
    },
    featured:{
        type: Boolean,
        required: true,
        default: false
    },
    discount:{
        type:{
            type:String,
            // required: true,
            enum: ['percentage', 'flat','BOGO','free shipping']
        },
        isPercentage:{
            type: Boolean,
            // required: true,
            default: false
        },
        value: {
            type: Number,
            // required: true
        },
        description: {
            type: String,
            // required: true
        },
        minQuantity: {
            type: Number,
            // required: true
        },
        maxAmount: {
            type: Number,
            // required: true
        },
        updatedAt:{
            typ : Date
        }
    }


});

module.exports = mongoose.model('Product', productSchema);
