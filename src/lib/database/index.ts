import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'Utsav',
      bufferCommands: false,
      
    }).then((mongoose) => {
      console.log('MongoDB connected successfully:', mongoose.connection.host);
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection failed:', error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};