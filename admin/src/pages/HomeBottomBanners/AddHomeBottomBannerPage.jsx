import AdminPageLayout from '../../components/common/AdminPageLayout';
import { CancelButton } from '../../components/common/ActionButtons';
import AddBanner from './addHomeBottomBanner';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';

export default function AddHomeBottomBannerPage({ onCancel, onSuccess }) {
  return (
    <AdminPageLayout
      title="Add Home Bottom Banner"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <ImageIcon fontSize="inherit" />, label: 'Banners', href: '/banners' },
        { label: 'Add Bottom Banner' }
      ]}
      actions={<CancelButton onClick={onCancel} />}
    >
      <AddBanner onSuccess={onSuccess} />
    </AdminPageLayout>
  );
}
