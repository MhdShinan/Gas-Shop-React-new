const express = require('express');
const router = express.Router();
const { searchUser } = require('../controllers/fetchDetailsController');

// POST /api/users/search - Search user by email
router.post('/search', searchUser);

module.exports = router;