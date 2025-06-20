const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;