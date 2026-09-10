//  const cloudinary = import('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadImage = (filePath, publicId) => {
//   return cloudinary.uploader.upload(filePath, {
//     public_id: publicId,
//     folder: 'e-shopping/products'
//   });
// };

// module.exports = { uploadImage }; 


const crypto = require('crypto');

const uploadImage = async (file, publicId) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const timestamp = Math.round(Date.now() / 1000);
  const toSign = `folder=e-shopping/products&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(toSign).digest('hex');

  const fd = new FormData();
  fd.append('file', new Blob([file.data], { type: file.mimetype || 'image/jpeg' }), file.name || `${publicId}.jpg`);
  fd.append('api_key', apiKey);
  fd.append('public_id', publicId);
  fd.append('folder', 'e-shopping/products');
  fd.append('timestamp', timestamp);
  fd.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
  return data;
};

module.exports = { uploadImage };