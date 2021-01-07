const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true, 
        required: true,
        maxLength: 32,
        text: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000,
        text: true
    },
    price: {
        type: Number,
        required: true,
        truim: true,
        maxLength: 32,
    },
    category: {
        type: ObjectId,
        ref: "Category"
    },
    quantity: {
        type: Number,
        sold: {
            type: Number,
            default: 0
        }
    },
    images: {
        type: Array
    },
    color: {
        type: String,
        enum: ['Black', 'Brown', 'Silver', 'White', 'Blue']
    },
    brand: {
        type: String,
        enum: ['Delaroq', 'The Line By K', 'Petite Studio', 'Retrouvai', 'Namesake']
    }
    // shipping: {
    //     type: String,
    //     enum: ['Yes', 'No']
    // }
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema);