import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI");
}

if (!DB_NAME) {
  throw new Error("Please define DB_NAME");
}

declare global {
  var mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongoose || {
  conn: null,
  promise: null,
};

global.mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
