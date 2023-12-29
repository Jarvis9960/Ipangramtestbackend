import express from "express";
const router  = express.Router();
import { loginUser, logout } from "../Controllers/AuthController.js";


router.post("/login", loginUser);
router.post("/logout", logout);


export default router;