import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();


export const setCookie = (res,userId)=>{
 const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
 res.cookie("token", token);
}
