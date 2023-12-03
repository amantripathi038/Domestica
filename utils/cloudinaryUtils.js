const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = async (filePath, folder, id) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            public_id: id,
            use_filename: true,
            overwrite: true
        });
        return result;
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        throw error;
    }
};
module.exports = uploadToCloudinary
