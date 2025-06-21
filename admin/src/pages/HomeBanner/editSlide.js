import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import { CancelButton } from '../../components/common/ActionButtons';
import SlideForm from './SlideForm';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { MyContext } from '../../App';
import { fetchDataFromApi, editData } from '../../utils/api';

export default function EditHomeSlide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ctx = useContext(MyContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDataFromApi(`/api/homeBanner/${id}`).then((res) => {
      if (res) {
        setData({
          overlayText: res.overlayText || '',
          ctaUrl: res.ctaUrl || '',
          position: res.position || 'center',
          image: res.images?.[0] || '',
        });
      }
    });
  }, [id]);

  if (!data) {
    return <LoadingSkeleton rows={8} />;
  }

  const handleSuccess = () => navigate('/homeBannerSlide');

  return (
    <AdminPageLayout
      title="Edit Home Slide"
      breadcrumbPath={[
        { icon: <HomeIcon />, label: 'Dashboard', href: '/' },
        { icon: <SlideshowIcon />, label: 'Home Slides', href: '/homeBannerSlide' },
        { label: 'Edit' },
      ]}
      actions={<CancelButton onClick={() => navigate('/homeBannerSlide')} />}
    >
      <SlideForm
        initialValues={data}
        requestUrl={`/api/homeBanner/${id}`}
        requestFn={editData}
        onSuccess={handleSuccess}
        onClose={() => navigate('/homeBannerSlide')}
      />
    </AdminPageLayout>
  );
}
