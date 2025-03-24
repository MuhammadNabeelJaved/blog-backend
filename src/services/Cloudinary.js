import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

async function uploadOnCloudinary(file) {
    // Configuration
    cloudinary.config({
        cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
        api_key: `${process.env.CLOUDINARY_API_KEY}`,
        api_secret: `${process.env.CLOUDINARY_API_SECRET}`
    });

    try {
        if (!file) return null;

        // Upload an image
        const uploadResult = await cloudinary.uploader
            .upload(file)
            .catch((error) => {
                console.log(error);
                return null;
            });

        // If upload is successful, remove the file from the temp folder
        if (uploadResult) {
            try {
                // Construct the full path to the file in the temp folder
                const tempFolderPath = path.join(process.cwd(), 'public', 'temp');
                const fileName = path.basename(file);
                const filePath = path.join(tempFolderPath, fileName);

                // Remove the file
                fs.unlinkSync(filePath);
                console.log(`File ${fileName} removed from temp folder`);
            } catch (removeError) {
                console.error('Error removing file from temp folder:', removeError);
            }
        }

        return uploadResult;

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return null;
    }
}

export default uploadOnCloudinary;