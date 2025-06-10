// Import required packages
require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db')

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the News Aggregation API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});