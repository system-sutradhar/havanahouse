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

export default function EditHomeBottomBanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ctx = useContext(MyContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDataFromApi(`/api/homeBottomBanners/${id}`).then((res) => {
      if (res) {
        setData({ catId: res.catId || '', subCatId: res.subCatId || '', media: res.images?.map(url => ({ url })) || [] });
      }
    });
  }, [id]);

  if (!data) {
    return <LoadingSkeleton rows={8} />;
  }

  const handleSuccess = () => navigate('/homeBottomBanners');

  return (
    <AdminPageLayout
      title="Edit Home Bottom Banner"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <ImageIcon fontSize="inherit" />, label: 'Banners', href: '/homeBottomBanners' },
        { label: 'Edit' },
      ]}
      actions={<CancelButton onClick={() => navigate('/homeBottomBanners')} />}
    >
      <BannerForm
        initialValues={data}
        requestUrl={`/api/homeBottomBanners/${id}`}
        requestFn={editData}
        onSuccess={handleSuccess}
        onCancel={() => navigate('/homeBottomBanners')}
      />
    </AdminPageLayout>
  );
}
