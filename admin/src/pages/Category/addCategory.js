import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import CategoryForm from './CategoryForm';

export default function AddCategory() {
  return (
    <AdminPageLayout
      title="Add Category"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <CategoryIcon fontSize="inherit" />, label: 'Categories', href: '/categories' },
        { label: 'Add' },
      ]}
    >
      <CategoryForm />
    </AdminPageLayout>
  );
}
