import { render, screen } from '@testing-library/react';
import Products from '../pages/Products';
import { MyContext } from '../App';

const Wrapper = ({ children }) => (
  <MyContext.Provider value={{ catData: {}, setAlertBox: () => {} }}>
    {children}
  </MyContext.Provider>
);

test('renders Add Product button', () => {
  render(<Products />, { wrapper: Wrapper });
  expect(screen.getByText(/Add Product/i)).toBeInTheDocument();
});
