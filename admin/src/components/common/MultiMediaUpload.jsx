import { IoCloseSharp } from 'react-icons/io5';
import { Box } from '@mui/material';
import { uploadMedia } from '../../utils/cloudinaryService';

export default function MultiMediaUpload({ value = [], onChange }) {
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const uploads = await Promise.all(
      files.map((file) => uploadMedia(file).catch(() => null))
    );
    const items = uploads
      .map((res, idx) =>
        res ? { url: res.url, public_id: res.public_id, type: files[idx].type } : null
      )
      .filter(Boolean);
    onChange([...value, ...items]);
    e.target.value = '';
  };

  const removeItem = (index) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <Box className="imgUploadBox">
      {value.map((item, idx) => (
        <div className="uploadBox" key={idx}>
          <span className="remove" onClick={() => removeItem(idx)}>
            <IoCloseSharp />
          </span>
          <div className="box">
            {item.type && item.type.startsWith('video') ? (
              <video src={item.url} className="w-100" controls />
            ) : (
              <img src={item.url} alt="preview" className="w-100" />
            )}
          </div>
        </div>
      ))}
      <div className="uploadBox">
        <input type="file" multiple accept="image/*,video/*" onChange={handleFiles} />
        <div className="info">
          <span>Upload</span>
        </div>
      </div>
    </Box>
  );
}
