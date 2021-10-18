const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({

})
orderSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
exports.Order = mongoose.model('Order', orderSchema)
