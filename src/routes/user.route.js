import express from "express"
import {
    addToFavourite, createOrder,
    foodRecommend, getFav, getFoodFromId, rateFoodItem,
    reviewFoodPartner, updateUser
} from "../controller/user.controller.js";
import multer from "multer"
const router = express.Router();



const upload = multer({
    storage: multer.memoryStorage(),
})

router.get("/get-recommendation/", foodRecommend);
router.get("/get-fav/:id", getFav);
router.post("/update-profile/:id", upload.fields([{ name: "profilePhoto", maxCount: 1 }]), updateUser);
router.post("/get-food/:id", getFoodFromId);
router.post("/create-order", createOrder);
router.post("/rate-food-item", rateFoodItem);
router.post("/review-food-partner", reviewFoodPartner);
router.post("/add-to-fav", addToFavourite);

export default router 