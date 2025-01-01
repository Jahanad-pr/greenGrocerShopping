const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items:[
        {
            _id: false,
            category:{
                type:mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Categorie"
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            is_collection:{
                type: Boolean,
                required: true,
                default: false
            }
        }
    ]
   
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
