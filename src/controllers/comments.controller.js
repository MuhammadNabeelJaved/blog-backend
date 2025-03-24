import Blog from "../models/blog.model.js";
import Comment from "../models/comments.model.js";
import ApiError from "../utils/apiErrors.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const createComment = asyncHandler(async (req, res, next) => {
    const { comment, blogId } = req.body;

    if (!comment) {
        return next(new ApiError(400, "Comment is required"));
    }
    if (!blogId) {
        return next(new ApiError(400, "Blog is required"));
    }
    const commentObj = {
        comment,
        user: req.user._id,
        blog: blogId
    }
    const newComment = await Comment.create(commentObj);

    // Update the blog's comments array
    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $push: { comments: newComment._id } },
        { new: true } // Return the updated blog
    );

    if (!updatedBlog) {
        return next(new ApiError(404, "Blog not found"));
    }

    res.status(201).json(new ApiResponse(newComment, "Comment created successfully"));
})

const getComments = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find().populate("user", "name email").populate("blog", "title");
    res.status(200).json(new ApiResponse(comments, "Comments fetched successfully"));
})

export { createComment,getComments }