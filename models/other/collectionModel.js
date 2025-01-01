const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    pic: {
        type: String,
        required: false
    },
    products: {
        type: Array,
        default:[],
        required: true,
        ref: 'Product'
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
        type: String,
        required: true.valueOf,
        ref:'Categorie'
    },
    description:{
        type: String,
        required: true
    },
    colorPrimary:{
        type: String,
        required: true
    },
    colorSecondary:{
        type: String,
        required: true
    }


});

module.exports = mongoose.model('Collection', collectionSchema);
