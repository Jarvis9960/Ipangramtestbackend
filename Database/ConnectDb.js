import mongoose from "mongoose";

const connectDb = () => {
  try {
    return mongoose.connect(process.env.DATABASE_URL);
  } catch (error) {
    throw new Error(
      "Something went wrong while connecting to database: " + error
    );
  }
};


export default connectDb;
