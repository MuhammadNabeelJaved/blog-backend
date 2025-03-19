import express from "express";
import { registerUser, loginUser, logoutUser, refreshToken, getProfile } from "../controllers/user.controller.js";
import upload from "../middlewares/fileUpload.middleware.js";
import authorizeUser from "../middlewares/auth.middleware.js"
import { get } from "mongoose";

const router = express.Router();

// router.route("/:id").get(authorizeUser, getProfile);
router.route("/register").post(upload.single('avatar'), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authorizeUser, logoutUser);
router.route("/genratenewrefreshtoken").post(authorizeUser, refreshToken);

export default router;