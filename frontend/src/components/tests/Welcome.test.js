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
        expect(screen.getByRole('heading', { name: /Welcome to Our Budget Management App!/i })).toBeInTheDocument();
        expect(screen.getByText(/This platform is designed to help you track and manage your finances with ease./i)).toBeInTheDocument();
        // Check for presence of buttons instead of links
        expect(screen.getByRole('button', { name: /Login to Your Account/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create a New Account/i })).toBeInTheDocument();
    });
});
