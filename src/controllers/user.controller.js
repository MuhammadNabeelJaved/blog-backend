import express from 'express';
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiErrors.js";
import User from '../models/user.model.js';
import uploadOnCloudinary from '../services/Cloudinary.js';
import ApiResponse from '../utils/apiResponse.js';
import jwt from "jsonwebtoken";



const genrateAccessAndRefreshToken = async (userId) => {
    try {

        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body

    const avatar = req?.file?.path

    console.log(fullName, email, password, avatar)

    if (!fullName || !email || !password || !avatar) {
        throw new ApiError(400, "Please provide full name, email, avatar and password fields");
    }

    const FindExistingUser = await User.findOne(
        {
            $or: [
                { email: email },
                { fullName: fullName }
            ]
        }
    )

    if (FindExistingUser) {
        throw new ApiError(400, "User already exists with this email or full name");
    }

    const uploadAvatarOnCloudinary = await uploadOnCloudinary(avatar)

    if (!uploadAvatarOnCloudinary) {
        throw new ApiError(500, "Avatar upload failed");
    }

    const createUser = await User.create({
        fullName,
        email,
        password,
        avatar: uploadAvatarOnCloudinary?.url
    })

    if (!createUser) {
        throw new ApiError(500, "User registration failed");
    }



    return res
        .status(201)
        .json(new ApiResponse(201, "User registered successfully.", createUser));
})

const loginUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body

    console.log(fullName, email, password)

    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password fields");
    }

    const FindUser = await User.findOne({
        $or: [
            { email: email },
            { fullName: fullName }
        ]
    })

    if (!FindUser) {
        throw new ApiError(404, "User not found with this email");
    }

    const isMatch = await FindUser.checkPassword(password)

    if (!isMatch) {
        throw new ApiError(401, "Invalid password");
    }


    const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(FindUser?._id)


    // Create a user object without the password field
    const user = FindUser.toObject();
    delete user.password;


    const options = {
        httpOnly: true,
        secure: true,
    }



    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, "User logged in successfully.", { user, accessToken, refreshToken }));
})

const getProfile = asyncHandler(async (req, res) => {
    const findUser = await User.findById(req.params.id)

    if (!findUser) {
        throw new ApiError(404, "User not found");
    }

    const user = findUser.toObject();
    delete user.password;

    return res
        .status(200)
        .json(new ApiResponse(200, "User profile fetched successfully.", user));
})

// Add a new function to get current user info
const getCurrentUser = asyncHandler(async (req, res) => {
    // req.user is set by the authorizeUser middleware
    const user = req.user.toObject();
    delete user.password;

    return res
        .status(200)
        .json(new ApiResponse(200, "User fetched successfully.", user));
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            refreshToken: undefined
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        expires: new Date(0)
    }

    return res
        .status(200)
        .clearCookie("refreshToken", "", options)
        .clearCookie("accessToken", "", options)
        .json(new ApiResponse(200, "User logged out successfully."));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        // Fixed: Get refresh token from body
        const incomingRefreshToken = req.body.refreshToken ||
            req.cookies?.refreshToken ||  // Try from cookies
            req.headers["x-refresh-token"]; // Try from custom header


        if (!incomingRefreshToken) {
            throw new ApiError(401, "Refresh token not found");
        }

        const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);

        if (!decoded) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const user = await User.findById(decoded?._id);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } = await genrateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true,
        }

        return res
            .status(200)
            .cookie("refreshToken", newRefreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, "Token refreshed successfully.", { accessToken, refreshToken: newRefreshToken }));
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh token");
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getProfile,
    getCurrentUser
}