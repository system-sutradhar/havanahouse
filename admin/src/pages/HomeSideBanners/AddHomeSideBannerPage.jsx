import AdminPageLayout from '../../components/common/AdminPageLayout';
import { CancelButton } from '../../components/common/ActionButtons';
import BannerForm from '../Banners/BannerForm';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';

export default function AddHomeSideBannerPage({ onCancel, onSuccess }) {
  return (
    <AdminPageLayout
      title="Add Home Side Banner"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <ImageIcon fontSize="inherit" />, label: 'Banners', href: '/banners' },
        { label: 'Add Side Banner' }
      ]}
      actions={<CancelButton onClick={onCancel} />}
    >
      <BannerForm
        createUrl="/api/homeSideBanners/create"
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </AdminPageLayout>
  );
}
