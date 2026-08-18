import mongoose from "mongoose";
export const connectDB = async () =>{
    await mongoose.connect(process.env.MONGO_URI).then(()=>console.log("DB Connected"));
 console.log("DB Connected");
    console.log("Database:", mongoose.connection.name);
    
}