import AdminPageLayout from '../../components/common/AdminPageLayout';
import { CancelButton, SaveButton } from '../../components/common/ActionButtons';
import AddHomeSlide from './addHomeSlide';
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
      actions={<CancelButton onClick={onCancel} />}
    >
      <AddHomeSlide onSuccess={onSuccess} onClose={onCancel} formId="add-slide-form" hideActions />
      <div className="mt-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <CancelButton onClick={onCancel} />
        <SaveButton form="add-slide-form" type="submit" label="Publish" />
      </div>
    </AdminPageLayout>
  );
}
