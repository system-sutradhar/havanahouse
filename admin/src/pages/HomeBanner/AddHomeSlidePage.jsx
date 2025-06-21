import AdminPageLayout from '../../components/common/AdminPageLayout';
import AddHomeSlide from './AddHomeSlide';
import HomeIcon from '@mui/icons-material/Home';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { useContext } from 'react';
import { MyContext } from '../../App';

export default function AddHomeSlidePage({ onCancel, onSuccess }) {
  const ctx = useContext(MyContext);
  return (
    <AdminPageLayout
      title="Add Home Slide"
      breadcrumbPath={[
        { icon: <HomeIcon />, label: 'Dashboard', href: '/' },
        { icon: <SlideshowIcon />, label: 'Home Slides', href: '/homeBannerSlide' },
        { label: 'Add' }
      ]}
    >
      <AddHomeSlide
        onSuccess={() => {
          if (onSuccess) onSuccess();
          ctx.setAlertBox({ open: true, error: false, msg: 'Slide Created!' });
        }}
        onClose={onCancel}
        formId="add-slide-form"
      />
    </AdminPageLayout>
  );
}
