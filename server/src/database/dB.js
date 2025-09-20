import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://ubuntuchaudhary:8t6eb1n5opVx5KyZ@cluster0.6xlxneh.mongodb.net/"
    );
    // app.on("ERROR", (error) => {
    //   console.log("ERRR", error);
    // });

    // app.listen(process.env.PORT, () => {
    //   console.log("app listen of port");
    // });
  } catch (error) {
    console.log("MONGO connection error", error);
  }
};

export default connectDB;
