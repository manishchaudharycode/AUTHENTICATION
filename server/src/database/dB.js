import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://ubuntuchaudhary:8t6eb1n5opVx5KyZ@cluster0.6xlxneh.mongodb.net/"
    );
  } catch (error) {
    console.log("MONGO connection error", error);
  }
};

export default connectDB;
