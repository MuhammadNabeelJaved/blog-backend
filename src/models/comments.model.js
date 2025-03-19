import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    comment: {
        type: String,
        required: [true, "Comment is required"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog"
    }
}, { timestamps: true })

const Comment = model("Comment", commentSchema)

export default Comment
// Compare this snippet from backend/src/controllers/blog.controller.js: