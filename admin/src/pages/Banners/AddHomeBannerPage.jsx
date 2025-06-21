import AdminPageLayout from '../../components/common/AdminPageLayout';
import { CancelButton } from '../../components/common/ActionButtons';
import AddBanner from './addHomeBanner';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';

export default function AddHomeBannerPage({ onCancel, onSuccess }) {
  return (
    <AdminPageLayout
      title="Add Home Banner"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <ImageIcon fontSize="inherit" />, label: 'Banners', href: '/banners' },
        { label: 'Add' }
      ]}
      actions={<CancelButton onClick={onCancel} />}
    >
      <AddBanner onSuccess={onSuccess} />
    </AdminPageLayout>
  );
}
