import dotenv from "dotenv";
import app from "../src/app.js";
import connectDB from "../src/config/db.js";
import mongoose from "mongoose";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Connect to database and clean up before running tests
beforeAll(async () => {
  await connectDB();
  
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Clean up after tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
});

export default app;