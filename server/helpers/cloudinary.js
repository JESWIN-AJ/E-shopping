 const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = (filePath, publicId) => {
  return cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    folder: 'e-shopping/products'
  });
};

module.exports = { uploadImage };