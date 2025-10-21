import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Acharam?directConnection=true';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

console.log(`🔌 Using MongoDB URI: ${MONGODB_URI.split('@').pop() || MONGODB_URI}`);

// Type for the cached connection
interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedMongoose;
}

// Initialize the cached connection if it doesn't exist
let cached: CachedMongoose = global.mongoose || { conn: null, promise: null };

/**
 * Establishes a connection to MongoDB using Mongoose
 * @returns Promise<mongoose.Connection>
 */
async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  // Create a new connection if none exists
  if (!cached.promise) {
    const opts: ConnectOptions = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority',
    };

    console.log('Creating new MongoDB connection...');
    
    // Create the connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
      });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset the promise if connection fails
    cached.promise = null;
    console.error('MongoDB connection failed:', e);
    throw e;
  }

  // Set up event listeners for the MongoDB connection
  const db = mongoose.connection;

  db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  db.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  db.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });

  // Handle application termination
  const gracefulShutdown = async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  };

  // Handle different termination signals
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);

  return cached.conn;
}

export { connectDB };


export default connectDB;
