import { render, screen } from '@testing-library/react';
import Notifications from '../pages/Notifications';
import { MyContext } from '../App';

const Wrapper = ({ children }) => (
  <MyContext.Provider value={{ setProgress: () => {}, setAlertBox: () => {} }}>
    {children}
  </MyContext.Provider>
);

test('renders Add Notification button', () => {
  render(<Notifications />, { wrapper: Wrapper });
  expect(screen.getByText(/Add Notification/i)).toBeInTheDocument();
});
