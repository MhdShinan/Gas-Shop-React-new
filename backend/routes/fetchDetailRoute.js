const express = require('express');
const router = express.Router();
const { searchUser, getUserDetails } = require('../controllers/fetchDetailsController');

// POST /api/users/search - Search user by email
router.post('/search', searchUser);

// GET /api/users/fetch-details - Get user details by email
router.get('/fetch-details', getUserDetails);

module.exports = router;