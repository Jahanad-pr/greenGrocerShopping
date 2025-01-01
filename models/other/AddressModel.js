const mongoose = require('mongoose');


const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // unique: true
    },
    FirstName: {
        type: String,
        required: true,
    },
    uniqueID:{
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        // required: true,
    },
    phone:{
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    },
    city:{
        type: String,
        required: true,
        // ref: 'Categorie'
    },
    exactAddress:{
        type: String,
        required: true,
    },
    landmark:{
        type: String,
        required: true,
    },
    streetAddress:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    pincode:{
        type: Number,
        required: true
    },
    locationType:{
        type: String,
        required: true,
        enum:['Home','Work','Friend','Other']
    }
    ,
    idDefault:{
        type: Boolean,
        required: true
    },
    location:{
        type: Number,
        // required: true
    },




});

module.exports = mongoose.model('Address', AddressSchema, 'Addresses');
