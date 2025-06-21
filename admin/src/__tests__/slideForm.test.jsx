import { render, screen } from '@testing-library/react';
import SlideForm from '../pages/HomeBanner/SlideForm';

// SlideForm does not rely on context

test('renders Slide form Overlay Text field', () => {
  render(<SlideForm onClose={() => {}} />);
  expect(screen.getByLabelText(/Overlay Text/i)).toBeInTheDocument();
});
