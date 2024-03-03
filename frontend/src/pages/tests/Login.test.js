import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../Login';
import { UserProvider } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import en from "../../translations/en/common.json";
import fr from "../../translations/fr/common.json";

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // preserve the original functionality
    useNavigate: jest.fn(), // mock useNavigate
}));

// Mock findUser Service Call
jest.mock('../../services/UserService', () => ({
    findUser: jest.fn(),
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

describe('LoginComponent', () => {
    let navigateMock;

    beforeEach(() => {
        navigateMock = jest.fn();
        useNavigate.mockImplementation(() => navigateMock); // mock implementation for each test
    });

    // Helper function to render the Login within Router and UserProvider
    const renderComponent = () => render(
        <Router>
            <I18nextProvider i18n={i18next}>
                <UserProvider>
                        <Login />
                </UserProvider>
            </I18nextProvider>
        </Router>
    );

    it('renders login inputs and button', () => {
        renderComponent();

        // Assert that the Username and Email input fields, and the Login button are rendered
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    it('allows inputting username and email', () => {
        renderComponent();

        // Simulate user input by changing the values of Username and Email input fields
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@email.com' } });

        // Assert that the input fields have the expected values
        expect(screen.getByPlaceholderText('Username').value).toBe('testuser');
        expect(screen.getByPlaceholderText('Email').value).toBe('test@email.com');
    });

    it('navigates to the signup page on "Sign up here" button click', () => {
        renderComponent();

        // Simulate a click on the "Sign up here" button
        fireEvent.click(screen.getByText(/Sign up here/i));

        // Assert that navigate was called with '/signup'
        expect(navigateMock).toHaveBeenCalledWith('/signup');
    });

    // Form Submission Test: simulates form submission with valid inputs
    it('submits the form with username and email', async () => {
        const { findUser } = require('../../services/UserService');
        findUser.mockResolvedValue({ name: 'testuser', email: 'test@email.com' });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@email.com' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(findUser).toHaveBeenCalledWith('testuser', 'test@email.com');
            expect(navigateMock).toHaveBeenCalledWith('/dashboard');
        });
    });

    // Error Handling Test - checks the behavior when login fails due to incorrect credentials
    it('displays an error message for incorrect credentials', async () => {
        const { findUser } = require('../../services/UserService');
        findUser.mockResolvedValue(null); // Simulate user not found

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'wrong@email.com' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText(/Login failed/)).toBeInTheDocument();
        });
    });


});
