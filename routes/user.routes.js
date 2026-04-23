import express from "express";
import { Router } from "express"; 
import { registerUser, verifyUser, login, getMe, logoutUser, forgotUserPassword, resetPassword } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";


const router = Router();


router.post("/register", registerUser);

router.post("/verify/:token", verifyUser);

router.post("/login", login);

router.get("/me", isLoggedIn, getMe);

router.get("/logout", isLoggedIn, logoutUser);

// router.route("/forgot-password").post(isLoggedIn, forgotUserPassword);

router.post( "/forgot-password", forgotUserPassword );
router.route( "/reset-password/:token" ).post( resetPassword );

export default router;