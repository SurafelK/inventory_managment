const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const moment = require('moment-timezone');
const Product = require('../models/productModel');
const ObjectId = require('mongodb').ObjectId;


// Create Order
const createOrder = asyncHandler(async (req, res) => {
  try {
    const { products, quantity, deliveryAddress, customerName, deliveryDate } = req.body;

    console.log(
      products,
      quantity,
      deliveryAddress,
      customerName,
      deliveryDate
    );

    const convertedDeliveryDate = convertToGMTPlus3(deliveryDate);

    if (!products || !quantity || !deliveryAddress || !customerName || !deliveryDate) {
      res.status(400).json({
        error: 'Please fill all required fields.'
      });
      return;
    }

    const order = await Order.create({
        products,
        quantity,
        deliveryAddress,
        customerName,
        deliveryDate: convertedDeliveryDate,
      });

      if (order) {
        res.status(201).json({
          message: {
            order: order.products,
            quantity: order.quantity,
            deliveryDate: order.deliveryDate,
            customerName: order.customerName,
            orderCreated: order.orderDate,
            orderStatus: order.status
          }
        });
      }  else {
      res.status(500).json({
        error: 'Error in creating the order.'
      });
    }
  } catch (err) {
    console.error('Error on Creating the order:', err);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});


// Convert Time to GMT+3

function convertToGMTPlus3(dateString) {
    const parsedDate = moment(dateString, moment.ISO_8601, true);

    if (!parsedDate.isValid()) {
      throw new Error('Invalid date format');
    }
  
    return parsedDate.tz('Africa/Nairobi').toDate();
}

// Get Orders


const getOrder = asyncHandler(async (req, res) => {
try {
    const orders = await Order.find();

    const productIds = orders.map(order => order.products).flat(); // Flatten the array of product IDs

    console.log(productIds);

    const products = [];

    for (const productId of productIds) {
        const product = await Product.findById(productId);
        
        if (product) {
            products.push(product);
        } else {
            console.log(`Product with ID ${productId} not found.`);
        }
    }

    console.log(products);

    res.status(200).json(products);
} catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
}
});
module.exports = {
  createOrder,
  getOrder
};
