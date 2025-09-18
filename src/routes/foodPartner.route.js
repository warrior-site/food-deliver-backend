import express from "express"
import { checkEmail, checkAuth, register, login, logout } from "../controller/foodPartnerAuth.controller.js"
import { addFood, changeStatus, getAllOrders, updateFoodPartner } from "../controller/foodPartner.controller.js"
import multer from "multer"
const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage(),
})


router.post("/check-email", checkEmail)
router.get("/check-auth", checkAuth)
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)

//food add
router.post("/add-food",
    upload.fields([{ name: "photos", maxCount: 2 }, { name: "video", maxCount: 1 }]),
    addFood)
router.put(
    "/update-foodpartner/:id",
    upload.fields([{ name: "logo", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]),
    updateFoodPartner
);
router.post("/get-orders", getAllOrders)
router.post("/change-status", changeStatus)

export default router