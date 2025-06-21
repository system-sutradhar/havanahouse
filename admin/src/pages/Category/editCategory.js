import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import { CancelButton } from '../../components/common/ActionButtons';
import CategoryForm from './CategoryForm';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { MyContext } from '../../App';
import { fetchDataFromApi, editData } from '../../utils/api';

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ctx = useContext(MyContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDataFromApi(`/api/category/${id}`).then((res) => {
      const cat = res?.categoryData?.[0];
      if (cat) {
        setData({ name: cat.name, color: cat.color, image: cat.images?.[0] || '' });
      }
    });
  }, [id]);

  if (!data) {
    return <LoadingSkeleton rows={8} />;
  }

  const handleSuccess = () => navigate('/category');

  return (
    <AdminPageLayout
      title="Edit Category"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <CategoryIcon fontSize="inherit" />, label: 'Categories', href: '/category' },
        { label: 'Edit' },
      ]}
      actions={<CancelButton onClick={() => navigate('/category')} />}
    >
      <CategoryForm
        initialValues={data}
        requestUrl={`/api/category/${id}`}
        requestFn={editData}
        onSuccess={handleSuccess}
        onCancel={() => navigate('/category')}
      />
    </AdminPageLayout>
  );
}
