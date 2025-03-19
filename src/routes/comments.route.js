import express from "express";
import { createComment, getComments } from "../controllers/comments.controller.js";
import upload from "../middlewares/fileUpload.middleware.js";
import authorizeUser from "../middlewares/auth.middleware.js"


const router = express.Router();

router.route("/post-comment").post(authorizeUser, upload.single(""), createComment);
router.route("/get-comments").get(getComments);



export default router;