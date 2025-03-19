import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // role: {
    //     type: String,
    //     enum: ["user", "admin"],
    //     default: "user",
    //     // required: true,
    // },
    avatar: {
        type: String,
        default: "https://via.placeholder.com/150",
    },
    refreshToken: {
        type: String,
    },

}, { timestamps: true });

userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.genrateAccessToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_SECRET_EXPIRY });
}

userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRY });
}

const User = model("User", userSchema);

export default User