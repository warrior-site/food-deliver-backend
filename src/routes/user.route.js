import express from "express"
import { addToFavourite, createOrder, foodRecommend, getFoodFromId, rateFoodItem, reviewFoodPartner } from "../controller/user.controller.js";
const router = express.Router();

router.get("/get-recommendation/",foodRecommend);
router.post("/get-food/:id",getFoodFromId)
router.post("/create-order",createOrder)
router.post("/rate-food-item",rateFoodItem)
router.post("/review-food-partner",reviewFoodPartner)
router.post("/add-to-fav",addToFavourite)

export default router 