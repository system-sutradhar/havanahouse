import { render, screen } from '@testing-library/react';
import BannerForm from '../pages/Banners/BannerForm';
import { MyContext } from '../App';

const Wrapper = ({ children }) => (
  <MyContext.Provider value={{ catData: { categoryList: [] } }}>{children}</MyContext.Provider>
);

test('renders Banner form Category select', () => {
  render(<BannerForm onCancel={() => {}} />, { wrapper: Wrapper });
  expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
});
