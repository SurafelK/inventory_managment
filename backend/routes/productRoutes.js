const express = require ('express');
const { createProduct, updateProduct } = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const { isSalesManager } = require('../middleware/salesManagerMiddleware');
const router = express.Router();

router.post( '/create', protect,isSalesManager,createProduct)
router.post('/update/:_id', updateProduct)

module.exports = router