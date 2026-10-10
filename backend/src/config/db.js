const mongoose = require("mongoose");

const connectDB = async () => {
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not configured. Add it to backend/.env before starting the server.",
    );
  }

  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");
};

module.exports = connectDB;
