import axios from 'axios';

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.error('Missing Cloudinary configuration. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET in .env');
}

export async function uploadMedia(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error('Missing Cloudinary configuration.');
    return null;
  }
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
  const { data } = await axios.post(url, formData);
  return { url: data.secure_url, public_id: data.public_id };
}

export function deleteMedia(publicId) {
  return axios.post('/api/cloudinary/delete', { publicId });
}
