import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Dashboard from './Dashboard';

// Describe block for the Dashboard page test suite
describe('Dashboard', () => {
    const mockUser = { name: 'John Doe' };

    it('displays a welcome message to the logged-in user', () => {
        render(
            <Router>
                {/* Provide a mock user value using UserContext.Provider */}
                <UserContext.Provider value={{ user: mockUser }}>
                    <Dashboard />
                </UserContext.Provider>
            </Router>
        );

        // Check if the welcome message is displayed for the mock user
        expect(screen.getByText(`Welcome, ${mockUser.name}!`)).toBeInTheDocument();
    });
});
