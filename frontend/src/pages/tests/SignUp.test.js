import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from '../../contexts/UserContext';
import SignUp from '../SignUp';
import { useNavigate } from 'react-router-dom';
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import en from "../../translations/en/common.json";
import fr from "../../translations/fr/common.json";

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Use actual for all non-hook parts
    useNavigate: jest.fn(), // Mock useNavigate
}));

i18next.init({
    lng: 'en', // Use English for tests or adjust as necessary
    resources: {
        en: {
            global: en
        },
        fr: {
            global: fr
        },
    }
});

describe('SignUpForm', () => {
    let navigateMock;

    beforeEach(() => {
        navigateMock = jest.fn();
        useNavigate.mockImplementation(() => navigateMock); // Provide mock implementation
    });

    // Helper function to render the SignUp component within Router and UserProvider
    const renderComponent = () => render(
        <Router>
            <I18nextProvider i18n={i18next}>
                <UserProvider>
                    <SignUp />
                </UserProvider>
            </I18nextProvider>
        </Router>

    );

    it('renders the sign-up form with name and email fields and a submit button', () => {
        renderComponent();

        // Assert that the Name and Email input fields, and the Sign Up button are rendered
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /app.Sign-up-sign-up/i })).toBeInTheDocument();
    });

    it('allows entering name and email', () => {
        renderComponent();

        // Simulate user input by changing the values of Name and Email input fields
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });

        // Assert that the input fields have the expected values
        expect(screen.getByPlaceholderText('Username').value).toBe('John Doe');
        expect(screen.getByPlaceholderText('Email').value).toBe('john@example.com');
    });

    it('navigates to the login page on "Login here" button click', () => {
        renderComponent();

        // Simulate a click on the "Login here" button
        fireEvent.click(screen.getByText(/app.Sign-up-login-here/i));

        // Assert that navigate was called with '/login'
        expect(navigateMock).toHaveBeenCalledWith('/login');
    });
});
