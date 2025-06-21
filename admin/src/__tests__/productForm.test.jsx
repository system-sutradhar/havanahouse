import { render, screen } from '@testing-library/react';
import ProductForm from '../pages/Products/ProductForm';
import { MyContext } from '../App';

const Wrapper = ({ children }) => (
  <MyContext.Provider value={{ catData: { categoryList: [] } }}>{children}</MyContext.Provider>
);

test('renders Product form Name field', () => {
  render(<ProductForm onCancel={() => {}} />, { wrapper: Wrapper });
  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
});
