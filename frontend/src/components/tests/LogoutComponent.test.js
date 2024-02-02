import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LogoutComponent from '../LogoutComponent';
import { UserContext } from "../../contexts/UserContext";

// Mock UserProvider for testing
const mockSetUser = jest.fn();
const MockUserProvider = ({ children }) => (
    <UserContext.Provider value={{ user: {}, setUser: mockSetUser }}>
        {children}
    </UserContext.Provider>
);

// Test suite for LogoutComponent
describe('LogoutComponent', () => {
    // Mock window.confirm
    beforeEach(() => {
        window.confirm = jest.fn();
    });

    // Test if the logout button is rendered
    it('renders the logout button', () => {
        render(
            <Router>
                <MockUserProvider>
                    <LogoutComponent />
                </MockUserProvider>
            </Router>
        );
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    // Test if clicking the logout button and confirming logs out the user
    it('logs out the user on button click after confirmation', () => {
        // Mock confirmation to simulate user agreement
        window.confirm.mockImplementation(() => true);

        render(
            <Router>
                <MockUserProvider>
                    <LogoutComponent />
                </MockUserProvider>
            </Router>
        );

        // Simulate a click on the logout button
        fireEvent.click(screen.getByRole('button', { name: /logout/i }));

        // Verify if the mockSetUser function was called with null after confirmation
        expect(mockSetUser).toHaveBeenCalledWith(null);
    });

    // Test if clicking the logout button and cancelling does not log out the user
    it('does not log out the user on button click if user cancels the confirmation', () => {
        // Mock confirmation to simulate user cancellation
        window.confirm.mockImplementation(() => false);

        render(
            <Router>
                <MockUserProvider>
                    <LogoutComponent />
                </MockUserProvider>
            </Router>
        );

        // Simulate a click on the logout button
        fireEvent.click(screen.getByRole('button', { name: /logout/i }));

        // Verify if the mockSetUser function was not called after cancellation
        expect(mockSetUser).not.toHaveBeenCalled();
    });
});
