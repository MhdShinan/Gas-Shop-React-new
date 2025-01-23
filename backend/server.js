require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// CORS middleware
app.use(cors());

// Increase the payload size limit to handle large requests (e.g., large images in base64)
app.use(express.json({ limit: '10mb' }));  // for JSON payloads
app.use(express.urlencoded({ limit: '10mb', extended: true }));  // for form-data payloads

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connected'))
  .catch((err) => console.error(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Server setup
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
