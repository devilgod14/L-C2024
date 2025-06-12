// Import required packages
require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const authRouter = require('./src/api/authRoutes');
const newsRoutes = require('./src/api/newsRoutes'); 

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use('/api/auth',authRouter);
app.use('/api/news', newsRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the News Aggregation API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});