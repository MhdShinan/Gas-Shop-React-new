const OrderStatus = require('../models/orderStatusModel');
const axios = require('axios');
const User = require('../models/userModel');
const crypto = require('crypto'); // Add this at the top with other imports

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

    // Find user by email
    const user = await User.findOne({ email: orderData.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify user has phone number
    if (!user.contactNumber) {
      return res.status(400).json({ message: 'Phone number not registered' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999);
    const otpExpiry = Date.now() + 600000; // 10 minutes

    // Update user record
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Format phone number for Notify.lk (convert to 94 format)
    let phoneNumber = user.contactNumber;
    phoneNumber = phoneNumber.replace(/^0/, '94'); // Replace leading 0 with 94
    phoneNumber = phoneNumber.replace(/^\+94/, '94'); // Remove + prefix

    // Send SMS via Notify.lk
    const response = await axios.post('https://app.notify.lk/api/v1/send', {
      user_id: process.env.NOTIFY_LK_USER_ID,
      api_key: process.env.NOTIFY_LK_API_KEY,
      sender_id: process.env.NOTIFY_LK_SENDER_ID,
      to: phoneNumber,
      message: `Your OTP is ${otp}. Valid for 10 minutes.`,
    });

    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'SMS sending failed');
    }

    res.status(200).json({ message: 'OTP sent via SMS successfully' });
  } catch (error) {
    console.error('SMS Error:', error);
    res.status(500).json({ 
      message: 'Failed to send OTP',
      error: error.response?.data?.message || error.message
    });
  }
};

exports.verifyOrderOTP = async (req, res) => {
  try {
    const { email, otp, orderData } = req.body;

    const user = await User.findOne({
      email,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

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