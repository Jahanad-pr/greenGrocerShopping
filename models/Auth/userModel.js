const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    tag_name: {
        type: String,
    },
    phone: {
        type: Number,
    },
    place: {
        type: String,
    },
    gender: {
        type: String,
    },
    pic:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isListed:{
        type:Boolean,
        default:false
    },
    googleMail:{
        type:String,
        default:''
    },
    couponApplyed:{
        type:Object,
        default:{}
    },
    wallet:{
        amount:{
            type:Number,
            default:0
        },
        createdAt:{
            type:Date,
            default:Date.now()
        },
        updatedAt:{
            type:Date,
            default:Date.now()
        }
    },
    profileUrl:{
        type:String,
        default:''
    },
    location: {
        first: {
            type: Object,
            default: {}
        },
        second: {
            type: Object,
            default: {}
        },
        third: {
            type: Object,
            default: {}
        },
    },
});

module.exports = mongoose.model('User', userSchema);
