import { render, screen } from '@testing-library/react';
import SettingForm from '../components/admin/settings/SettingForm';

test('renders Save and Cancel buttons', () => {
  render(<SettingForm open onClose={() => {}} onSuccess={() => {}} />);
  expect(screen.getByText(/Save/i)).toBeInTheDocument();
  expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
});
