const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})
userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
exports.User = mongoose.model('User', userSchema)