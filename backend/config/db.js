import mongoose from "mongoose";
export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://dhruv:gambhir@cluster0.9zltgb5.mongodb.net/food-del').then(()=>console.log("DB Connected"));

}