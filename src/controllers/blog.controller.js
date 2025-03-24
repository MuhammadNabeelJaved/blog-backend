import Blog from "../models/blog.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiErrors.js";
import ApiResponse from "../utils/apiResponse.js";
import uploadOnCloudinary from "../services/Cloudinary.js";
import User from "../models/user.model.js";



const createBlog = asyncHandler(async (req, res) => {
    const { title, description, content } = req.body
    const image = req.file?.path; // Access the uploaded image from req.file
    const user = req.user._id;


    if (!(title || description || content || image)) {
        throw new ApiError(400, "Please provide title, description, content and image fields");
    }

    const uploadedBlogImageOnCloudinary = await uploadOnCloudinary(image)

    if (!uploadedBlogImageOnCloudinary) {
        throw new ApiError(500, "Image upload failed");
    }

    const newBlog = await Blog.create({
        title,
        description,
        content,
        image: uploadedBlogImageOnCloudinary?.url,
        user,
    })

    if (!newBlog) {
        throw new ApiError(500, "Blog creation failed");
    }

    return res.status(201).json(new ApiResponse(201, "Blog created successfully", newBlog))
})


const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({}).populate("user", "fullName avatar email")
        .populate(
            {
                path: "comments",
                populate: { path: "user", select: "fullName avatar email" }
            }
        );

    if (!blogs) {
        throw new ApiError(404, "No blogs found");
    }

    return res.status(200).json(new ApiResponse(200, "All blogs", blogs));
});

const currentUserBlogs = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const userBlogs = await Blog.find({ user: user?._id })

    if (!userBlogs) {
        throw new ApiError(404, "No blogs found for this user")
    }

    const totalBlogsComments = userBlogs.reduce((acc, blog) => {
        return acc + blog.comments.length
    }, 0)

    // if (!totalBlogsComments) {
    //     throw new ApiError(404, "No comments found for this user")
    // }


    return res.status(200).json(new ApiResponse(200, "User blogs", { userBlogs, totalBlogsComments }));
})



export {
    createBlog,
    getAllBlogs,
    currentUserBlogs,
}