import { useContext, useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import { IoCloseSharp } from 'react-icons/io5';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import BaseTable from '../../components/common/BaseTable';
import { AddButton, CancelButton } from '../../components/common/ActionButtons';
import DeleteConfirmDialog from '../../components/common/DeleteConfirmDialog';
import AddSubCat from './addSubCat';
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData } from '../../utils/api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const SubCategory = () => {
  const [catData, setCatData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const context = useContext(MyContext);

  const loadCategories = () => {
    context.setProgress(20);
    fetchDataFromApi('/api/category').then((res) => {
      setCatData(res);
      context.setProgress(100);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCategories();
  }, []);

  const deleteSubCat = () => {
    if (!deleteId) return;
    context.setProgress(30);
    deleteData(`/api/subCat/${deleteId}`).then(() => {
      context.setProgress(100);
      loadCategories();
      context.setAlertBox({ open: true, error: false, msg: 'Subcategory Deleted!' });
    }).finally(() => {
      setConfirmOpen(false);
      setDeleteId(null);
    });
  };

  const rows = (catData?.categoryList || []).filter(c => c.children?.length).map((item) => ({
    id: item._id,
    image: item.images[0],
    name: item.name,
    children: item.children
  }));

  if (showForm) {
    return (
      <AdminPageLayout
        title="Add Sub Category"
        breadcrumbPath={[
          { icon: <HomeIcon fontSize='inherit' />, label: 'Dashboard', href: '/' },
          { icon: <CategoryIcon fontSize='inherit' />, label: 'Category', href: '/category' },
          { label: 'Add Sub Category' },
        ]}
        actions={<CancelButton onClick={() => setShowForm(false)} />}
      >
        <AddSubCat
          onCancel={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); loadCategories(); }}
        />
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Sub Category List"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize='inherit' />, label: 'Dashboard', href: '/' },
        { icon: <CategoryIcon fontSize='inherit' />, label: 'Category', href: '/category' },
        { label: 'Sub Category' },
      ]}
      actions={
        <AddButton onClick={() => setShowForm(true)} label="Add Sub Category" />
      }
    >
      <div className='card shadow border-0 p-3 mt-4'>
        <BaseTable
          columns={[
            {
              label: 'IMAGE',
              field: 'image',
              render: (row) => (
                <div className='imgWrapper' style={{ width: '50px' }}>
                  <div className='img card shadow m-0'>
                    <LazyLoadImage alt='image' effect='blur' className='w-100' src={row.image} />
                  </div>
                </div>
              )
            },
            { label: 'CATEGORY', field: 'name' },
            {
              label: 'SUB CATEGORY',
              field: 'children',
              render: (row) => (
                <>
                  {row.children.map((sub) => (
                    <span key={sub._id} className='badge badge-primary mx-1'>
                      {sub.name}{' '}
                      <IoCloseSharp className='cursor' onClick={() => { setDeleteId(sub._id); setConfirmOpen(true); }} />
                    </span>
                  ))}
                </>
              )
            }
          ]}
          rows={rows}
        />
      </div>
      <DeleteConfirmDialog
        open={confirmOpen}
        onCancel={() => { setConfirmOpen(false); setDeleteId(null); }}
        onConfirm={deleteSubCat}
      />
    </AdminPageLayout>
  );
};

export default SubCategory;
