// MongoDB connection setup
import mongoose from 'mongoose';
import connectDB from './db-mongodb';
import * as models from './models';

// Connect to MongoDB
connectDB().catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Export mongoose connection and models
export { mongoose, models };

export const db = {
  connection: mongoose.connection,
  ...models,
};
