import express from "express"
import authRoutes from "./routes/auth.route.js"
import foodPartnerRoutes from "./routes/foodPartner.route.js"

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

export default app;