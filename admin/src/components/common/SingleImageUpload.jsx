import { IoCloseSharp } from 'react-icons/io5';
import { Box } from '@mui/material';

export default function SingleImageUpload({ preview, onChange, onRemove }) {
  return (
    <Box className="imgUploadBox">
      {preview ? (
        <div className="uploadBox">
          <span className="remove" onClick={onRemove}>
            <IoCloseSharp />
          </span>
          <div className="box">
            <img src={preview} alt="preview" className="w-100" />
          </div>
        </div>
      ) : (
        <div className="uploadBox">
          <input type="file" onChange={onChange} />
          <div className="info">
            <span>Image Upload</span>
          </div>
        </div>
      )}
    </Box>
  );
}
