const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')

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

module.exports = {
    createProduct
}