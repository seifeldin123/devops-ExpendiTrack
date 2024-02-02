import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Nav from '../Nav';
import {UserContext, UserProvider} from '../../contexts/UserContext';

describe('Nav', () => {
    it('shows dashboard and logout for authenticated users', () => {
        render(
            <Router>
                <UserContext.Provider value={{ user: { name: 'John Doe' } }}>
                    <Nav />
                </UserContext.Provider>
            </Router>
        );
        // Ensure that Dashboard and Logout are displayed for authenticated users
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('renders Canada.ca and GCWeb links for unauthenticated users', () => {
        render(
            <Router>
                <UserProvider>
                    <Nav />
                </UserProvider>
            </Router>
        );

        // Assert that Canada.ca and GCWeb links are rendered
        expect(screen.getByText('Canada.ca')).toBeInTheDocument();
        expect(screen.getByText('GCWeb')).toBeInTheDocument();
    });
});
