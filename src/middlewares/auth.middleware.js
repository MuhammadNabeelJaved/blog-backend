import jwt from "jsonwebtoken";
import ApiError from "../utils/apiErrors.js";
import User from "../models/user.model.js";



const authorizeUser = async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return next(new ApiError(401, "Please login to access this route"));
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        if (!decoded) {
            return next(new ApiError(401, "Invalid token"));
        }

        const user = await User.findById(decoded?._id);

        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        req.user = user;
        next();

    } catch (error) {
        return next(new ApiError(401, "Invalid token"));

    }

}


export default authorizeUser;