import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//Export a function that connect to db 
const connectDb = async () => {
    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.log("Error Connecting to MongoDB");
        })
}

export default connectDb;