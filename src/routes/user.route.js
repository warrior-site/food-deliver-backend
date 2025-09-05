import express from "express"
import { foodRecommend } from "../controller/user.controller.js";
const router = express.Router();

router.get("/get-recommendation/",foodRecommend);

export default router