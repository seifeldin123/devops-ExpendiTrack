import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { UserContext } from "../../contexts/UserContext";
import { BrowserRouter as Router } from 'react-router-dom';

describe('Header Component', () => {
    // Mock user for logged in state
    const mockUserLoggedIn = { name: 'John Doe', email: 'john@example.com' };

    // Render Header Component
    it('renders the Header component', () => {
        const { getByRole } = render(
            <Router>
                <UserContext.Provider value={{ user: null }}>
                    <Header />
                </UserContext.Provider>
            </Router>
        );
        expect(getByRole('banner')).toBeInTheDocument();
    });

    // Display Language Selection
    it('displays language selection links', () => {
        const { getByText } = render(
            <Router>
                <UserContext.Provider value={{ user: null }}>
                    <Header />
                </UserContext.Provider>
            </Router>
        );
        expect(getByText('Français')).toBeInTheDocument();
    });

    // Display Brand Logo
    it('displays the brand logo', () => {
        const { getByAltText } = render(
            <Router>
                <UserContext.Provider value={{ user: null }}>
                    <Header />
                </UserContext.Provider>
            </Router>
        );
        expect(getByAltText('Government of Canada')).toBeInTheDocument();
    });

    // Perform Search
    it('allows user to type in the search box', () => {
        const { getByPlaceholderText } = render(
            <Router>
                <UserContext.Provider value={{ user: null }}>
                    <Header />
                </UserContext.Provider>
            </Router>
        );
        const searchBox = getByPlaceholderText(/Search Canada.ca/i);
        fireEvent.change(searchBox, { target: { value: 'test search' } });
        expect(searchBox.value).toBe('test search');
    });

    // Display Navigation Menu
    it('displays navigation menu items', () => {
        const { getByText } = render(
            <Router>
                <UserContext.Provider value={{ user: null }}>
                    <Header />
                </UserContext.Provider>
            </Router>
        );
        expect(getByText('Jobs and the workplace')).toBeInTheDocument();
        expect(getByText('Immigration and citizenship')).toBeInTheDocument();
    });

    // Render Logout Component(user logged in)
    it('renders Header with user logged in, showing Logout component', () => {
        const { getByRole } = render(
            <Router>
                <UserContext.Provider value={{ user: mockUserLoggedIn }}>
                    <Header />
                </UserContext.Provider>
            </Router>
        );
        // Use getByRole to target the button specifically
        expect(getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });

    // Hide Logout Component(user logged out)
    it('renders Header with no user logged in, not showing Logout component', () => {
        const { queryByText } = render(
            <Router>
                <UserContext.Provider value={{ user: null }}>
                    <Header />
                </UserContext.Provider>
            </Router>
        );
        expect(queryByText(/Logout/i)).not.toBeInTheDocument();
    });

    // Navigate to Nav Component
    it('navigates to the Nav component', () => {
        const { getByText } = render(
            <Router>
                <UserContext.Provider value={{ user: null }}>
                    <Header />
                </UserContext.Provider>
            </Router>
        );
        expect(getByText('GCWeb')).toBeInTheDocument();
    });

});
