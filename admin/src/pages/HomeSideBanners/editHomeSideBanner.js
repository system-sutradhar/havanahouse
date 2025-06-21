import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import { CancelButton } from '../../components/common/ActionButtons';
import BannerForm from '../Banners/BannerForm';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { MyContext } from '../../App';
import { fetchDataFromApi, editData } from '../../utils/api';

export default function EditHomeSideBanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ctx = useContext(MyContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDataFromApi(`/api/homeSideBanners/${id}`).then((res) => {
      if (res) {
        setData({ catId: res.catId || '', subCatId: res.subCatId || '', media: res.images?.map(url => ({ url })) || [] });
      }
    });
  }, [id]);

  if (!data) {
    return <LoadingSkeleton rows={8} />;
  }

  const handleSuccess = () => navigate('/homeSideBanners');

  return (
    <AdminPageLayout
      title="Edit Home Side Banner"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <ImageIcon fontSize="inherit" />, label: 'Banners', href: '/homeSideBanners' },
        { label: 'Edit' },
      ]}
      actions={<CancelButton onClick={() => navigate('/homeSideBanners')} />}
    >
      <BannerForm
        initialValues={data}
        requestUrl={`/api/homeSideBanners/${id}`}
        requestFn={editData}
        onSuccess={handleSuccess}
        onCancel={() => navigate('/homeSideBanners')}
      />
    </AdminPageLayout>
  );
}
