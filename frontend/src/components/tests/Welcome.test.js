import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Welcome from '../Welcome'; // Import the Welcome component to be tested

describe('Welcome', () => {
    it('renders the welcome message', () => {
        // Render the Welcome component within a BrowserRouter
        render(
            <BrowserRouter>
                <Welcome />
            </BrowserRouter>
        );
        // Ensure that the expected welcome message and navigation links are rendered
        expect(screen.getByText('Welcome to Our App!')).toBeInTheDocument();
        expect(screen.getByText('This is the best place to manage your budget efficiently.')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });
});
