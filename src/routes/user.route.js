import express from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    getProfile, 
    getCurrentUser 
} from "../controllers/user.controller.js";
import upload from "../middlewares/fileUpload.middleware.js";
import authorizeUser from "../middlewares/auth.middleware.js";

const router = express.Router();

// User profile routes
router.route("/profile/:id").get(authorizeUser, getProfile);
router.route("/me").get(authorizeUser, getCurrentUser);

// Authentication routes
router.route("/register").post(upload.single('avatar'), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authorizeUser, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;