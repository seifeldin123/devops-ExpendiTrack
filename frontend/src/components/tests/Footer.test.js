import React from 'react';
import { render } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
    it('renders Footer component without errors', () => {
        render(<Footer />);
    });
});
