import { render, screen } from '@testing-library/react';
import App from './App';

test('renders officer portal heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /Officer Portal/i });
  expect(headingElement).toBeInTheDocument();
});
