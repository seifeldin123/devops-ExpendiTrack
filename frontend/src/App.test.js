import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders Welcome page of Budgeting App', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to the Budgeting App/i);
  expect(linkElement).toBeInTheDocument();
});
