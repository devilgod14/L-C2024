const express = require('express');
const router = express.Router();
const { registerUser,loginUser } = require('../services/authService'); 
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/signup', async (req, res) => {
  try {

    const newUser = await registerUser(req.body);
    const userToReturn = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
    
    res.status(201).json(userToReturn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const token = await loginUser(email, password);

        res.json({ token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

router.get('/me', isAuthenticated, (req, res) => {
    res.status(200).json(req.user);
});


module.exports = router;