import AdminPageLayout from '../../components/common/AdminPageLayout';
import { CancelButton, SaveButton } from '../../components/common/ActionButtons';
import AddHomeSlide from './addHomeSlide';
import HomeIcon from '@mui/icons-material/Home';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import Stack from '@mui/material/Stack';

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
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="mt-3" justifyContent="flex-end">
        <CancelButton onClick={onCancel} />
        <SaveButton form="add-slide-form" type="submit" label="Publish" />
      </Stack>
    </AdminPageLayout>
  );
}
