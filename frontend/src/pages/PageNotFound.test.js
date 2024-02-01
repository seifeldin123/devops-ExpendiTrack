import React from 'react';
import { render, screen } from '@testing-library/react';
import PageNotFound from './PageNotFound';

describe('PageNotFound', () => {
    it('displays a not found message', () => {
        render(<PageNotFound />);
        // Ensure that the "Page Not Found" message is displayed
        expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });
});
