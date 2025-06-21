import AdminPageLayout from '../../components/common/AdminPageLayout';
import AddHomeSlide from './AddHomeSlide';
import HomeIcon from '@mui/icons-material/Home';
import SlideshowIcon from '@mui/icons-material/Slideshow';

export default function AddHomeSlidePage({ onCancel, onSuccess }) {
  return (
    <AdminPageLayout
      title="Add Home Slide"
      breadcrumbPath={[
        { icon: <HomeIcon />, label: 'Dashboard', href: '/' },
        { icon: <SlideshowIcon />, label: 'Home Slides', href: '/homeBannerSlide' },
        { label: 'Add' }
      ]}
    >
      <AddHomeSlide onSuccess={onSuccess} onClose={onCancel} formId="add-slide-form" />
    </AdminPageLayout>
  );
}
