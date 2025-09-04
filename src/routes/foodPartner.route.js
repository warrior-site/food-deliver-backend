import express from "express"
import { checkEmail, checkAuth, register, login, logout  } from "../controller/foodPartnerAuth.controller.js"
const router = express.Router()


router.post("/check-email", checkEmail)
router.get("/check-auth", checkAuth)
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)



export default router