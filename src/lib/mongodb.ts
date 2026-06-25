import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV === "production") {
  console.warn("CRITICAL: MONGODB_URI is not defined in production environment variables!");
}

const finalUri = MONGODB_URI || "mongodb://localhost:27017/cyberrunner";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 10000, // Extend timeout for serverless
      socketTimeoutMS: 45000,
    };

    console.log("Connecting to MongoDB...");
    cached!.promise = mongoose.connect(finalUri, opts).then((mongooseInstance) => {
      console.log("MongoDB Connected Successfully");
      return mongooseInstance;
    }).catch((err) => {
      console.error("MongoDB Connection Failed:", err.message);
      cached!.promise = null; // Reset promise to allow retry
      throw err;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
