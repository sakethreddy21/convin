import mongoose from 'mongoose';
require('dotenv').config()
// Define an async function to connect to MongoDB
export const connectMongoDB = async (): Promise<void> => {
  const mongoURI: string | undefined = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error("MongoDB connection URI is not defined in the environment variables.");
    process.exit(1); // Exit the process if no URI is provided
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process on error
  }
};
