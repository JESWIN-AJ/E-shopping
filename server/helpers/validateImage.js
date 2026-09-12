const { fileTypeFromBuffer } = require('file-type');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

async function validateImageFile(file) {
  if (!file || !file.data) {
    return { valid: false, error: 'No file provided' };
  }

  const detected = await fileTypeFromBuffer(file.data);

  if (!detected || !ALLOWED_TYPES.includes(detected.mime)) {
    return { valid: false, error: 'File must be a JPEG, PNG, or WEBP image' };
  }

  return { valid: true, mime: detected.mime, ext: detected.ext };
}

module.exports = { validateImageFile };