const mongoose = require('mongoose')

//schema
const productSchema = mongoose.Schema({
    name : {
        type : String,
        required: true 
    },
    description : {
        type : String,
        required: true 
    },
    rishDescription : {
        type : String,
        default : ''
    },
    image : {
        type : String,
        default: '' 
    },
    images : [{
        type : String,
        required: true 
    }],
    brand : {
        type : String,
        default: '' 
    },
    price : {
        type : Number,
        default: 0     
    },
    category : {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'Category',
       required: true
    }, 
    countInStock: {
        type : Number,
        required: true,
        min : 0,
        max : 250
    },
    rating : {
        type : Number,
        default: 0     
    },
    isFeatured : {
        type : Boolean,
        default: false     
    },
    dateCreated : {
        type : Date,
        default: Date.now     
    },
})
productSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
//moduls
exports.Product = mongoose.model('Product', productSchema)