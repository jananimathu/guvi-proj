import express from "express";
import { getProfile, signin, signup, updateProfile } from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/updateProfile", auth, updateProfile)
router.get("/getProfile", auth, getProfile)

export default router;