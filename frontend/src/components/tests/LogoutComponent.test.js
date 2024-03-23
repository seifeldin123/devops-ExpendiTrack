import React from 'react';
import {render, screen, fireEvent, within} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LogoutComponent from '../LogoutComponent';
import { UserContext } from "../../contexts/UserContext";
import enTranslations from "../../translations/en/common.json";
import frTranslations from "../../translations/fr/common.json";
import i18next from "i18next";
import {initReactI18next} from "react-i18next";

// Mock UserProvider for testing
const mockSetUser = jest.fn();
const MockUserProvider = ({ children }) => (
    <UserContext.Provider value={{ user: {}, setUser: mockSetUser }}>
        {children}
    </UserContext.Provider>
);

const resources = {
    en: {
        translation: enTranslations,
    },
    fr: {
        translation: frTranslations,
    },
};

i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

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
    it('logs out the user on button click after confirmation', async () => {
        // Mock confirmation to simulate user agreement
        window.confirm.mockImplementation(() => true);

        render(
            <Router>
                <MockUserProvider>
                    <LogoutComponent />
                </MockUserProvider>
            </Router>
        );

        // Find and click the initial logout button to open the modal
        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);

        // Wait for the modal to appear and find the confirmation button within it
        const modal = await screen.findByTestId('modal-logout');
        const modalWithin = within(modal);
        const confirmButton = modalWithin.getByRole('button', { name: /logout/i });

        // Click the confirmation button
        fireEvent.click(confirmButton);

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
