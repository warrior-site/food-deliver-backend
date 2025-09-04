import jwt from "jsonwebtoken"


export const setCookie = (res,userId)=>{
 const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
 res.cookie("token", token);
}
