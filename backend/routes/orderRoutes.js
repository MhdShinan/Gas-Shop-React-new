// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderStatus);
router.post('/verify-otp', orderController.verifyOrderOTP);

module.exports = router;