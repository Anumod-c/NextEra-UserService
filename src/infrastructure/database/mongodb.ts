import mongoose from "mongoose";
import config from "../config/config";

export const databaseConnection = async () => {
  try {
    await mongoose.connect(config.DATABASE_URL);
    console.log("Databse Connected");
  } catch (error) {
    console.log(error, "Database connection error");
  }
};
