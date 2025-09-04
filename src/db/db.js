import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();


 export const connectToDB = async ()=>{
  (await mongoose.connect(process.env.MONGO_URI)).then(
    () => console.log("connected to db")
  ).catch((error) => console.error("Error connecting to db:", error))
}