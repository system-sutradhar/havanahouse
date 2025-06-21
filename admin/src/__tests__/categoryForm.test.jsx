import { render, screen } from '@testing-library/react';
import CategoryForm from '../pages/Category/CategoryForm';
import { MyContext } from '../App';

const Wrapper = ({ children }) => (
  <MyContext.Provider value={{ setAlertBox: () => {} }}>{children}</MyContext.Provider>
);

test('renders Category form Save button', () => {
  render(<CategoryForm onCancel={() => {}} />, { wrapper: Wrapper });
  expect(screen.getByText(/Save/i)).toBeInTheDocument();
  expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
});
