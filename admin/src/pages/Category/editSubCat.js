import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import { FaCloudUploadAlt } from 'react-icons/fa';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import { MyContext } from '../../App';
import { fetchDataFromApi, editData } from '../../utils/api';

const EditSubCat = () => {
  const { id } = useParams();
  const [categoryVal, setCategoryVal] = useState('');
  const [catData, setCatData] = useState([]);
  const [formFields, setFormFields] = useState({ category: '', subCat: '' });
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();
  const context = useContext(MyContext);

  useEffect(() => {
    fetchDataFromApi(`/api/subCat/${id}`).then((res) => {
      if (res) {
        setFormFields({ category: res.category.id, subCat: res.subCat });
        setCategoryVal(res.category.id);
      }
    });
    setCatData(context.catData?.categoryList || []);
  }, [id, context.catData]);

  const handleChangeCategory = (e) => {
    const val = e.target.value;
    setCategoryVal(val);
    setFormFields((prev) => ({ ...prev, category: val }));
  };

  const inputChange = (e) => {
    setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const editSubCat = (e) => {
    e.preventDefault();
    if (!formFields.category || !formFields.subCat.trim()) {
      context.setAlertBox({ open: true, error: true, msg: 'Please fill all fields' });
      return;
    }
    setIsLoading(true);
    editData(`/api/subCat/${id}`, formFields)
      .then(() => {
        context.fetchCategory();
        history('/subCategory');
      })
      .finally(() => setIsLoading(false));
  };

  const handleCancel = () => history('/subCategory');

  return (
    <AdminPageLayout
      title="Edit Sub Category"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize='inherit' />, label: 'Dashboard', href: '/' },
        { icon: <CategoryIcon fontSize='inherit' />, label: 'Category', href: '/category' },
        { label: 'Edit Sub Category' },
      ]}
    >
      <AdminFormLayout onSubmit={editSubCat}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Select
              value={categoryVal}
              onChange={handleChangeCategory}
              displayEmpty
              fullWidth
              name='category'
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {catData.map((cat) => (
                <MenuItem key={cat.id || cat._id} value={cat.id || cat._id} className='text-capitalize'>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name='subCat'
              value={formFields.subCat}
              onChange={inputChange}
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
    </AdminPageLayout>
  );
};

export default EditSubCat;
