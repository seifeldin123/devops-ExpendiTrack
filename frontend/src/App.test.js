import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { UserProvider } from './contexts/UserContext';

describe('App Routing', () => {
    it('renders LoginComponent for "/login" route', () => {
        window.history.pushState({}, '', '/login');
        render(
            <UserProvider>
                <App />
            </UserProvider>
        );
        // Use query that targets specific text within LoginComponent if "Login" appears multiple times
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });

    it('renders SignUpForm for "/signup" route', () => {
        window.history.pushState({}, '', '/signup');
        render(
            <UserProvider>
                <App />
            </UserProvider>
        );
        // Similarly, target a unique element within SignUpForm
        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    });
});
