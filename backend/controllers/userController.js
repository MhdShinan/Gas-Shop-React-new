const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

let generatedOTP = null;  // In-memory OTP storage for now (could be stored in a database or session)

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register User
exports.registerUser = async (req, res) => {
  const { name, address, email, contactNumber, password, retypePassword } = req.body;

  // Check if passwords match
  if (password !== retypePassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Generate OTP and send to email
  generatedOTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP Code is: ${generatedOTP}`,
  });

  // Temporarily store user data (excluding password) until OTP verification
  res.status(200).json({
    message: 'OTP sent successfully. Verify your email to complete registration.',
    user: { name, address, email, contactNumber },
  });
};

// Verify OTP and Save User
exports.verifyOTP = async (req, res) => {
  const { otp, user } = req.body;

  // Compare OTP with the generated one
  if (parseInt(otp) === generatedOTP) {
    // Hash password before saving to DB
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({
      ...user,
      password: hashedPassword,  // Save hashed password
    });

    await newUser.save();
    generatedOTP = null;  // Clear OTP after use
    return res.status(201).json({ message: 'Registration successful!' });
  }

  res.status(400).json({ message: 'Invalid OTP' });
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if email or password is missing
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user does not exist
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If everything is correct, login successful
    res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
