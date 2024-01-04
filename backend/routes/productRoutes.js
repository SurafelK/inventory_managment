const express = require ('express');
const { createProduct, updateProduct, getSingleProduct, getAllProducts } = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const { isSalesManager, isSalesManagerorDriver } = require('../middleware/salesManagerMiddleware');
const router = express.Router();

router.post( '/create', protect,isSalesManager,createProduct)
router.post('/update/:_id', protect, isSalesManager,updateProduct)
router.get('/getproduct/:_id', getSingleProduct)
router.get('/getproducts',protect,isSalesManagerorDriver,getAllProducts)

module.exports = router