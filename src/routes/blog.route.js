import express from "express";
import authorizeUser from "../middlewares/auth.middleware.js";
import { createBlog, getAllBlogs, currentUserBlogs } from "../controllers/blog.controller.js";
import upload from "../middlewares/fileUpload.middleware.js";


const router = express.Router();

router.route("/create-blog").post(upload.single('image'), authorizeUser, createBlog)
router.route("/").get(getAllBlogs)
router.route("/current-user-blog-post").post(authorizeUser, currentUserBlogs)


export default router;