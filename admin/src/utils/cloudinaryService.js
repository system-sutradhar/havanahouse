import axios from 'axios';

// Read environment variables at call time so tests without .env don't log errors
function getConfig() {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    console.error(
      'Missing Cloudinary configuration. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET in .env'
    );
    return null;
  }
  return { cloudName, uploadPreset };
}

export async function uploadMedia(file) {
  const cfg = getConfig();
  if (!cfg) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cfg.uploadPreset);
  const url = `https://api.cloudinary.com/v1_1/${cfg.cloudName}/auto/upload`;
  const { data } = await axios.post(url, formData);
  return { url: data.secure_url, public_id: data.public_id };
}

export function deleteMedia(publicId) {
  return axios.post('/api/cloudinary/delete', { publicId });
}
