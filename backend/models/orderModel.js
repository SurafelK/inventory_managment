const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    products:{
        type: mongoose.Schema.Types.ObjectId,
        required:[true, "Please Enter The Product"],
        ref: "product"
    },

    quantity: {
        type: Number,
      required: [true, "Please Enter quantity of the order"],
      min: 0,
    },
    deliveryAddress: {
        type: String,
        required: [true, "Please Enter the delivery address"],
        trim: [true, "please Enter The Delivery Address"],
    },
    customerName: {
      type: String,
      required: [true, "please Enter The Customer Address"],
    },
    orderDate: {
      type: Date,
      required: [true, "Please Enter The Order Date"],
      default: Date.now,
    },
    deliveryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
},

)

const Order = mongoose.model("Order", orderSchema);
 module.exports = Order;