import mongoose from "mongoose";

let connectionPromise;

const connectDB = async () => {
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = new Promise(async (resolve, reject) => {
    try {
      // Handle connection with longer timeout
      const options = {
        connectTimeoutMS: 15000,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: "majority",
      };

      await mongoose.connect(process.env.MONGO_URI, options);

      console.log("MongoDB connected");
      resolve();
    } catch (error) {
      console.error("Database connection failed:", error.message);
      reject(error);
    }
  });

  return connectionPromise;
};

export default connectDB;