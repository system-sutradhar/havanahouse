import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import { CancelButton } from '../../components/common/ActionButtons';
import BannerForm from './BannerForm';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { MyContext } from '../../App';
import { fetchDataFromApi, editData } from '../../utils/api';

export default function EditBanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ctx = useContext(MyContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDataFromApi(`/api/banners/${id}`).then((res) => {
      if (res) {
        setData({ catId: res.catId || '', subCatId: res.subCatId || '', media: res.images?.map(url => ({ url })) || [] });
      }
    });
  }, [id]);

  if (!data) {
    return <LoadingSkeleton rows={8} />;
  }

  const handleSuccess = () => navigate('/banners');

  return (
    <AdminPageLayout
      title="Edit Banner"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <ImageIcon fontSize="inherit" />, label: 'Banners', href: '/banners' },
        { label: 'Edit' },
      ]}
      actions={<CancelButton onClick={() => navigate('/banners')} />}
    >
      <BannerForm
        initialValues={data}
        requestUrl={`/api/banners/${id}`}
        requestFn={editData}
        onSuccess={handleSuccess}
        onCancel={() => navigate('/banners')}
      />
    </AdminPageLayout>
  );
}
