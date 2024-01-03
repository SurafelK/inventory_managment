const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    products:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
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
        trim: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
      required: [true, "delivery date"]
    },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
})

const Order = mongoose.model("Order", orderSchema);
 module.exports = Order;