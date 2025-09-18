import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://ubuntuchaudhary:8t6eb1n5opVx5KyZ@cluster0.6xlxneh.mongodb.net/');
};