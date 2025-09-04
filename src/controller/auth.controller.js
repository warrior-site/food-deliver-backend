import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { setCookie } from "../utils/setCookies.js"

export const checkEmail = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ message: "Email is required" })
    }
    // Check if email exists in the database
    const user = await User.findOne({ email })
    if (user) {
        return res.status(409).json({ message: "Email already exists" })
    }
    return res.status(200).json({ message: "Email is available" })
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            success: true,
            message: "User is authenticated",
            user: {
                ...user._doc,
                password: undefined, // Exclude password from response
            }
        });
    } catch (error) {
        console.error("Error in checkAuth:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const register = async (req, res) => {
    const { username, email, password } = req.body

    try {

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await new User({
            username,
            email,
            password: hashedPassword
        })
        await user.save();
        setCookie(res, user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                username: user.username,
                _id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error)
    }
}

export const login = async (req,res)=>{
    const {email,password} = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        setCookie(res, user._id);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                username: user.username,
                _id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


