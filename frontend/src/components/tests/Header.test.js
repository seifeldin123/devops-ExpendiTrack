import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { UserContext } from "../../contexts/UserContext";
import { BrowserRouter as Router } from 'react-router-dom';

describe('Header Component', () => {
    // Mock user for logged in state
    const mockUserLoggedIn = { name: 'John Doe', email: 'john@example.com' };

    // Test rendering with user logged in
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

    // Test rendering with no user logged in
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

    // Test for search functionality
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
});
