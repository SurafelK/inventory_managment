const express = require('express')
const { createOrder, getOrder } = require('../controllers/orderController')
const protect = require('../middleware/authMiddleware')
const { isSalesManager } = require('../middleware/salesManagerMiddleware')
const router = express.Router()

router.post('/create', protect,isSalesManager,createOrder)
router.get('/getorder', getOrder)

module.exports = router