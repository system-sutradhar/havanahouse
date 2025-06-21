import AdminPageLayout from '../../components/common/AdminPageLayout';
import { CancelButton } from '../../components/common/ActionButtons';
import BannerForm from './BannerForm';
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
      <BannerForm
        createUrl="/api/banners/create"
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </AdminPageLayout>
  );
}
