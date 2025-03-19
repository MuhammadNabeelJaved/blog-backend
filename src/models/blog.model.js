import { Schema, model } from "mongoose";


const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: String,
        default: null,
        // required: true
    },

}, { timestamps: true })

const Blog = model("Blog", blogSchema)

export default Blog