require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const { setupEmail } = require('./src/utils/emailUtil');

const authRoutes = require('./src/api/authRoutes');
const newsRoutes = require('./src/api/newsRoutes');
const userRoutes = require('./src/api/userRoutes');
const articleRoutes = require('./src/api/articleRoutes');
const notificationRoutes = require('./src/api/notificationRoutes');
const adminRoutes =require('./src/api/adminRoutes');
const categoryRoutes = require('./src/api/categoryRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {

    await connectDB();

    const emailTransporter = await setupEmail();

    require('./src/jobs/newsFetcherJob')(emailTransporter);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;