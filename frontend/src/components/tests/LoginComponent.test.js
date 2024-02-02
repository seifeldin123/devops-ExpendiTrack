import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginComponent from '../LoginComponent';
import { UserProvider } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // preserve the original functionality
    useNavigate: jest.fn(), // mock useNavigate
}));

describe('LoginComponent', () => {
    let navigateMock;

    beforeEach(() => {
        navigateMock = jest.fn();
        useNavigate.mockImplementation(() => navigateMock); // mock implementation for each test
    });

    // Helper function to render the LoginComponent within Router and UserProvider
    const renderComponent = () => render(
        <Router>
            <UserProvider>
                <LoginComponent />
            </UserProvider>
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
});
