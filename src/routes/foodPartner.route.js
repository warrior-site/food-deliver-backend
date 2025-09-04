import express from "express"
import { checkEmail, checkAuth, register, login, logout } from "../controller/foodPartnerAuth.controller.js"
import { addFood } from "../controller/foodPartner.controller.js"
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

export default router