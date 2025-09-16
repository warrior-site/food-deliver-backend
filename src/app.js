import express from "express"
import authRoutes from "./routes/auth.route.js"
import foodPartnerRoutes from "./routes/foodPartner.route.js"
import userRoute from "./routes/user.route.js"
import cors from "cors"
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If you need to send cookies or authentication headers
}));




app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/food-partner", foodPartnerRoutes);
app.use("/api/user",userRoute)

export default app;