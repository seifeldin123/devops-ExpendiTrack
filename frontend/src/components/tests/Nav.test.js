// Nav.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Nav from '../Nav';
import * as UserContextModule from '../../contexts/UserContext'; // Import the module to mock the hook

// Mock the useUserContext hook
jest.mock('../../contexts/UserContext', () => ({
    useUserContext: jest.fn(),
}));

describe('Nav Component', () => {
    it('shows Dashboard link for authenticated users', () => {
        // Mock useUserContext to return a user object, simulating an authenticated user
        UserContextModule.useUserContext.mockImplementation(() => ({ user: { name: 'John Doe' } }));

        render(
            <Router>
                <Nav />
            </Router>
        );

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders Canada.ca and GCWeb links for unauthenticated users', () => {
        // Mock useUserContext to return null for user, simulating an unauthenticated user
        UserContextModule.useUserContext.mockImplementation(() => ({ user: null }));

        render(
            <Router>
                <Nav />
            </Router>
        );

        expect(screen.getByText('Canada.ca')).toBeInTheDocument();
        expect(screen.getByText('GCWeb')).toBeInTheDocument();
    });
});
