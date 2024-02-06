import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { BudgetProvider } from './contexts/BudgetContext'; // Import BudgetProvider

describe('App Routing', () => {
    it('renders Login for "/login" route', () => {
        window.history.pushState({}, '', '/login');
        render(
            <UserProvider>
                <BudgetProvider> {/* Included BudgetProvider */}
                    <App />
                </BudgetProvider>
            </UserProvider>
        );
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });

    it('renders SignUpForm for "/signup" route', () => {
        window.history.pushState({}, '', '/signup');
        render(
            <UserProvider>
                <BudgetProvider> {/* Included BudgetProvider */}
                    <App />
                </BudgetProvider>
            </UserProvider>
        );
        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    });

});
