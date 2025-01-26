// backend/models/orderStatusModel.js
const mongoose = require('mongoose'); // Add this line

const orderStatusSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  orderCount: { type: Number, default: 0 },
  orders: [{
    product: String,
    price: Number,
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'declined'], 
      default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now },
    telegramMessageId: Number
  }]
});

module.exports = mongoose.model('OrderStatus', orderStatusSchema);