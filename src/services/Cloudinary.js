import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



async function uploadOnCloudinary(file) {
    // Configuration
    cloudinary.config({
        cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
        api_key: `${process.env.CLOUDINARY_API_KEY}`,
        api_secret: `${process.env.CLOUDINARY_API_SECRET}` // Click 'View API Keys' above to copy your API secret
    });

    try {
        if (!file) return null;

        // Upload an image
        const uploadResult = await cloudinary.uploader
            .upload(
                file
            )
            .catch((error) => {
                console.log(error);
            });

        // fs.unlinkSync(file);

        console.log(uploadResult);
        return uploadResult;

    } catch (error) {
        // fs.unlinkSync(file);
        console.error(error);

    }

}


export default uploadOnCloudinary;