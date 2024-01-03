const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please Enter name of the Product"],
      trim: true,
    },
    quantity: {
        type: String,
        required: [true, "Enter quantity"],
        enum: [ '300ml','500ml'],
        min: 0,
      },
    price: {
      type: Number,
      required: [true, "Please Enter price of the Product"],
      min: 0,
    },
    createdAT: {
        type: Date,
        default: () => new Date(new Date().getTime() + (3 * 60 * 60 * 1000)), // Add 3 hours dynamically
      },
  },);

  const Product = mongoose.model("Product", productSchema);

  module.exports = Product;