const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGO_URI);
    // Log a success message to the console, including the host it connected to
    console.log(`MongoDB Connected: ${dbConnection.connection.host}`);
  } catch (error) {
    // Log the error if the connection fails
    console.error(`Error: ${error.message}`);
    // Exit the process with a failure code
    process.exit(1);
  }
};
module.exports = connectDB;