const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

/**
 * Registers a new user
 * @param {object} userData - The user data (username, email, password)
 * @returns {object} The created user object (without password)
 */
async function registerUser(userData) {
    console.log(userData)
  const { username, email, password } = userData;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists with that email');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  return user;
}


/**
 * Logs in a user
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {string} A JWT token
 */
async function loginUser(email, password) {

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials'); 
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials'); 
  }

  const payload = {
    user: {
      id: user.id,
      role: user.role, 
      username: user.username,
      email: user.email, 
    },
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' } 
  );

  return token;
}

module.exports = {
  registerUser,
  loginUser,
};