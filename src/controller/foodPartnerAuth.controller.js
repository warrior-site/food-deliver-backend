import FoodPartner from "../models/foodPartner.model.js";
import bcrypt from "bcryptjs";
import { setCookie } from "../utils/setCookies.js";

export const checkEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const partner = await FoodPartner.findOne({ email });
    if (partner) {
        return res.status(409).json({ message: "Email already exists" });
    }

    return res.status(200).json({ message: "Email is available" });
};

export const checkAuth = async (req, res) => {
    try {
        const partner = await FoodPartner.findById(req.userId);
        if (!partner) {
            return res.status(404).json({ error: "Partner not found" });
        }

        res.status(200).json({
            success: true,
            message: "Partner is authenticated",
            partner: {
                ...partner._doc,
                password: undefined, // don’t expose password
            }
        });
    } catch (error) {
        console.error("Error in checkAuth:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const partner = new FoodPartner({
            name,
            email,
            password: hashedPassword
        });
        await partner.save();

        setCookie(res, partner._id);

        res.status(201).json({
            success: true,
            message: "Food Partner registered successfully",
            partner: {
                _id: partner._id,
                name: partner.name,
                email: partner.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const partner = await FoodPartner.findOne({ email });
        if (!partner) {
            return res.status(404).json({ message: "Partner not found" });
        }

        const isMatch = await bcrypt.compare(password, partner.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        setCookie(res, partner._id);

        res.status(200).json({
            success: true,
            message: "Food Partner logged in successfully",
            partner: {
                _id: partner._id,
                name: partner.name,
                email: partner.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Food Partner logged out successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
