const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const crypto = require('crypto');
const axios = require('axios'); // Add this at the top with other imports

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
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

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body; // Changed from phoneNumber to email

    const user = await User.findOne({
      email, // Changed from contactNumber to email
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

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};