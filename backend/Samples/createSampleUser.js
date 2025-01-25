const User = require('../models/userModel');

const createSampleUser = async () => {
  const user = new User({
    name: 'John Doe',
    address: '123 Main St',
    email: 'johndoe@example.com',
    contactNumber: '1234567890',
    password: 'password123',
  });

  await user.save();
  console.log('Sample user created:', user);
};

createSampleUser();