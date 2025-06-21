import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ProductForm from './ProductForm';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { MyContext } from '../../App';
import { fetchDataFromApi, editData } from '../../utils/api';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ctx = useContext(MyContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      if (res) {
        setData({
          name: res.name || '',
          description: res.description || '',
          brand: res.brand || '',
          price: res.price || '',
          oldPrice: res.oldPrice || '',
          discount: res.discount || '',
          countInStock: res.countInStock || '',
          category: res.category || '',
          subCategory: res.subCategory || '',
          isFeatured: res.isFeatured || '',
          ringGauge: res.ringGauge || '',
          lengthInInches: res.lengthInInches || '',
          binder: res.binder || '',
          filler: res.filler || '',
          origin: res.origin || '',
          wrapperType: res.wrapperType || '',
          strength: res.strength || '',
          flavorNotes: res.flavorNotes || [],
          tastingNotes: res.tastingNotes || [],
          pairingSuggestions: res.pairingSuggestions || [],
          boxType: res.boxType || '',
          badgeIcons: res.badgeIcons || [],
          trustLabels: res.trustLabels || [],
          complianceNotes: res.complianceNotes || '',
          productRam: res.productRam || [],
          productSize: res.productSize || [],
          productWeight: res.productWeight || [],
          location: res.location || '',
          rating: res.rating || 0,
          media: (res.images || []).map((url) => ({ url })),
        });
      }
    });
  }, [id]);

  if (!data) {
    return <LoadingSkeleton rows={8} />;
  }

  const handleSuccess = () => navigate('/products');

  return (
    <ProductForm
      pageTitle="Edit Product"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <StorefrontIcon fontSize="inherit" />, label: 'Products', href: '/products' },
        { label: 'Edit' },
      ]}
      initialValues={data}
      requestUrl={`/api/products/${id}`}
      requestFn={editData}
      onSuccess={handleSuccess}
      onCancel={() => navigate('/products')}
    />
  );
}
