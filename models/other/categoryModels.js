const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    items: {
        type: Object,
        default:{
            collections:[],
            products:[]
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
            type: Date
        }

    }
}, { collation: { locale: 'en', strength: 2 } });

categorySchema.index({ name: 1 }, { 
    unique: true,
    collation: { locale: 'en', strength: 2 }
});

// Pre-save hook to check for existing categories
categorySchema.pre('save', async function(next) {
    const category = this;
    
    // Only run this validation for new categories or if name is modified
    if (!category.isNew && !category.isModified('name')) {
        return next();
    }

    const existingCategory = await mongoose.model('Categorie').findOne({
        name: new RegExp('^' + category.name + '$', 'i')
    });

    if (existingCategory) {
        const error = new Error(`Category "${category.name}" already exists (as "${existingCategory.name}")`);
        error.status = 400;
        return next(error);
    }
    next();
});

// Handle unique error
categorySchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Category name must be unique (case-insensitive)'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('Categorie', categorySchema);
