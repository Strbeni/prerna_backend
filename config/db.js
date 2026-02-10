import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URI );
        console.log("MongoDB connected successfully");

    }catch(err){
        console.log("Error in DB connection", err);
    }
}
export default connectDB;