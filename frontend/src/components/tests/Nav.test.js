import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Nav from '../Nav';
import * as UserContextModule from '../../contexts/UserContext';

// Mock the useUserContext hook
jest.mock('../../contexts/UserContext', () => ({
    useUserContext: jest.fn(),
}));

describe('Nav Component', () => {

    // Verify Navigation for Authenticated Users
    it('ensures Canada.ca and GCWeb links are not present for authenticated users', () => {
        UserContextModule.useUserContext.mockImplementation(() => ({ user: { name: 'John Doe' } }));
        render(
            <Router>
                <Nav />
            </Router>
        );
        expect(screen.queryByText('Canada.ca')).not.toBeInTheDocument();
        expect(screen.queryByText('GCWeb')).not.toBeInTheDocument();
    });

    // Verify Navigation for Unauthenticated Users
    it('ensures Dashboard link is not present for unauthenticated users', () => {
        UserContextModule.useUserContext.mockImplementation(() => ({ user: null }));
        render(
            <Router>
                <Nav />
            </Router>
        );
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });





});
