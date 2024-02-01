import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import PrivateRoute from './PrivateRoute';

// Mock components for testing
const DashboardMock = () => <div>Dashboard</div>;
const LoginMock = () => <div>Login Page</div>;

// Describe block for the PrivateRoute component test suite
describe('PrivateRoute', () => {
    it('renders the child component when the user is authenticated', () => {
        render(
            <Router>
                <UserContext.Provider value={{ user: { name: 'John Doe' } }}>
                    <Routes>
                        {/* Use PrivateRoute to render DashboardMock when the user is authenticated */}
                        <Route path="/" element={<PrivateRoute><DashboardMock /></PrivateRoute>} />
                    </Routes>
                </UserContext.Provider>
            </Router>
        );
        // Ensure that 'Dashboard' text is present when the user is authenticated
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('redirects to the login page when the user is not authenticated', () => {
        render(
            <Router>
                <UserContext.Provider value={{ user: null }}>
                    <Routes>
                        {/* Use PrivateRoute to render DashboardMock when the user is not authenticated */}
                        <Route path="/" element={<PrivateRoute><DashboardMock /></PrivateRoute>} />
                        <Route path="/login" element={<LoginMock />} />
                    </Routes>
                </UserContext.Provider>
            </Router>
        );
        // Ensure that 'Login Page' text is present when the user is not authenticated
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
});
