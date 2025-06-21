import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { FaCloudUploadAlt } from 'react-icons/fa';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData } from '../../utils/api';

const AddSubCat = ({ onCancel, onSuccess }) => {
  const [categoryVal, setCategoryVal] = useState('');
  const [catData, setCatData] = useState([]);
  const [formFields, setFormFields] = useState({ name: '', parentId: '' });
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();
  const context = useContext(MyContext);

  useEffect(() => {
    fetchDataFromApi('/api/category').then((res) => {
      setCatData(res?.categoryList || []);
    });
  }, []);

  const handleChangeCategory = (e) => {
    const id = e.target.value;
    setCategoryVal(id);
    setFormFields((prev) => ({ ...prev, parentId: id }));
  };

  const changeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const addSubCategory = async (e) => {
    e.preventDefault();
    if (!formFields.name.trim() || !formFields.parentId) {
      context.setAlertBox({ open: true, error: true, msg: 'Please fill all the details' });
      return;
    }
    setIsLoading(true);
    try {
      await postData('/api/category/create', {
        name: formFields.name,
        slug: formFields.name,
        parentId: formFields.parentId,
      });
      context.fetchCategory();
      if (onSuccess) onSuccess();
      else history('/subCategory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else history('/subCategory');
  };

  return (
    <AdminFormLayout onSubmit={addSubCategory}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Select
            value={categoryVal}
            onChange={handleChangeCategory}
            displayEmpty
            fullWidth
            name='parentId'
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {catData.map((cat) => (
              <MenuItem key={cat._id} value={cat._id} className='text-capitalize'>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='name'
            value={formFields.name}
            onChange={changeInput}
            label='Sub Category'
            fullWidth
          />
        </Grid>
      </Grid>
      <Box display='flex' justifyContent='flex-end' mt={3} gap={2}>
        <CancelButton onClick={handleCancel} />
        <SaveButton type='submit' startIcon={<FaCloudUploadAlt />} disabled={isLoading}>
          {isLoading ? <CircularProgress size={20} color='inherit' /> : 'Save'}
        </SaveButton>
      </Box>
    </AdminFormLayout>
  );
};

export default AddSubCat;
