const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const crypto = require('crypto');

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
    const { email } = req.body; // Changed from phoneNumber to email

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999);
    const otpExpiry = Date.now() + 600000; // 10 minutes expiry

    // Find user by email and update OTP
    const user = await User.findOneAndUpdate(
      { email }, // Changed from contactNumber to email
      { otp, otpExpiry },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send OTP via Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      html: `<div>
        <h3>Your One-Time Password (OTP)</h3>
        <p>Use this code to verify your order:</p>
        <h2>${otp}</h2>
        <p>This code expires in 10 minutes.</p>
      </div>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to email successfully' });

  } catch (error) {
    console.error('Error sending OTP via email:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
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