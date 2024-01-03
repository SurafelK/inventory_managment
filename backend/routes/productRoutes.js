const express = require ('express');
const { createProduct } = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const { isSalesManager } = require('../middleware/salesManagerMiddleware');
const router = express.Router();

router.post( '/create', protect,isSalesManager,createProduct)

module.exports = router