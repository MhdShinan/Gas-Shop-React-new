const OrderStatus = require('../models/orderStatusModel');
const axios = require('axios');
const User = require('../models/userModel');

const sendToTelegram = async (orderData, orderId) => {
  const message = `📦 New Order Request!\n\n` +
    `Email: ${orderData.email}\n` +
    `Product: ${orderData.product}\n` +
    `Price: ${orderData.price}\n` +
    `Delivery Type: ${orderData.deliveryType}\n` +
    (orderData.deliveryType === 'delivery' ? `Address: ${orderData.friendAddress}\n` : '') +
    `\nOrder ID: ${orderId}`;

  const keyboard = {
    inline_keyboard: [[
      { text: '✅ Accept', callback_data: `accept_${orderId}` },
      { text: '❌ Decline', callback_data: `decline_${orderId}` }
    ]]
  };

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        reply_markup: keyboard
      }
    );
    return response.data.result.message_id;
  } catch (error) {
    console.error('Telegram API Error:', error);
    return null;
  }
};

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Update order count
    let orderStatus = await OrderStatus.findOne({ userEmail: orderData.email });
    if (!orderStatus) {
      orderStatus = new OrderStatus({ userEmail: orderData.email });
    }
    orderStatus.orderCount += 1;

    // Create new order
    const newOrder = {
      product: orderData.product,
      price: orderData.price,
      status: 'pending'
    };
    
    // Send to Telegram and save message ID
    const telegramMessageId = await sendToTelegram(orderData, orderStatus._id);
    newOrder.telegramMessageId = telegramMessageId;

    orderStatus.orders.push(newOrder);
    await orderStatus.save();

    res.status(201).json({
      status: 'success',
      data: orderStatus
    });
  } catch (error) {
    res.status(500).json({ message: 'Order creation failed', error: error.message });
  }
};

// Add Telegram webhook handler
exports.handleTelegramCallback = async (callbackData) => {
  const [action, orderId] = callbackData.split('_');
  const validActions = ['accept', 'decline'];

  if (!validActions.includes(action)) return;

  try {
    const orderStatus = await OrderStatus.findOne({ 'orders._id': orderId });
    const order = orderStatus.orders.id(orderId);
    
    order.status = action + 'ed'; // accepted or declined
    await orderStatus.save();

    // Here you would typically notify the user (via email/websocket)
    // For simplicity, we'll just log it
    console.log(`Order ${orderId} ${action}ed`);
  } catch (error) {
    console.error('Error handling Telegram callback:', error);
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const orderStatus = await OrderStatus.findOne({
      'orders._id': req.params.id
    });
    
    if (!orderStatus) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderStatus.orders.id(req.params.id);
    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order status', error: error.message });
  }
};