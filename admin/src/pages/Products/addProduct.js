import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';

export default function ProductUpload() {
  const navigate = useNavigate();
  return (
    <ProductForm onSuccess={() => navigate('/products')} onCancel={() => navigate('/products')} />
  );
}
