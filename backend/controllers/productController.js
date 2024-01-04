const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')
const { default: mongoose } = require('mongoose')

const createProduct = asyncHandler ( async(req,res) =>
{
   const {name,price, quantity} =  req.body

   if(!name  || !price || !quantity)
   {
        res.status(400)
        throw new Error('Fill the required Field')
   }

   const productExists = await Product.findOne({name})


   if(productExists && productExists.quantity === quantity)
   {
        res.status(400)
        throw new Error ("Product already Exists")
   }
    const product = await Product.create({
        name,
        price,
        quantity,
    })

    if(product)
    {
        const {_id,name, price,quantity,createdAT} = product

         res.status(201).json(
            {
                _id,
                name,
                price,
                quantity,
                createdAT
            })
    } else{
        res.status(500)

        throw new Error("Error")
    }
   


} )
const updateProduct = asyncHandler(async (req, res) => {
    const pId = req.params._id; // Assuming 'productId' is the parameter name
    console.log(pId);
  
    try {
      const product = await Product.findById(pId);
  
      if (product) {
        const { name, quantity, price } = product;
  
        product.name = req.body.name || name;
        product.quantity = req.body.quantity || quantity;
        product.price = req.body.price || price;
  
        const updatedProduct = await product.save();
  
        res.status(200).json({
          _id: updatedProduct._id,
          name: updatedProduct.name,
          quantity: updatedProduct.quantity,
          price: updatedProduct.price,
        });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      // Handle any errors that occurred during the query
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  const getSingleProduct = asyncHandler( async(req,res) =>
  {
    const pId = req.params._id;

    try {
        const product = await Product.findById(pId)

        if(product)
        {
            const {name,quantity,price} = product
            res.status(200).json({
                message:{
                    name:name,
                    quantity:quantity,
                    price:price
                }
            })
        }

    } catch (error) {
        
    }
  } )

  const getAllProducts = asyncHandler( async(req,res) =>
  {
    try {
        const allProducts = await Product.find();
        
        // Assuming you want to return an array of products
        const productDetails = allProducts.map(product => ({
          name: product.name,
          quantity: product.quantity,
          price: product.price,
        }));
        
        res.status(200).json({
          products: productDetails,
        });
      } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      
  }
    
   )
  

module.exports = {
    createProduct,
    updateProduct,
    getSingleProduct,
    getAllProducts
}