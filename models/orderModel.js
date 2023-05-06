const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    user : { type: String, ref: 'User' },
    books : { type: String, ref: 'Book' },
    totalAmount: Number
})

const OrderModel = mongoose.model("order", orderSchema);
module.exports = OrderModel