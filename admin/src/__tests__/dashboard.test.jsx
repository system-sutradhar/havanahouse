import { render, screen } from '@testing-library/react';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';

test('renders Delete confirmation dialog', () => {
  render(
    <DeleteConfirmDialog open onCancel={() => {}} onConfirm={() => {}} />
  );
  expect(screen.getByText(/Confirm Delete/i)).toBeInTheDocument();
});
