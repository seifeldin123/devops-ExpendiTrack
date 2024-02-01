import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Nav from './Nav';
import { UserContext } from '../contexts/UserContext';

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

    it('shows login and signup for unauthenticated users', () => {
        render(
            <Router>
                <UserContext.Provider value={{ user: null }}>
                    <Nav />
                </UserContext.Provider>
            </Router>
        );
        // Ensure that Login and Sign Up are displayed for unauthenticated users
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });
});
