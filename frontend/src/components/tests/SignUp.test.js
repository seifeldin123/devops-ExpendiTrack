import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from '../../contexts/UserContext';
import SignUp from '../SignUp';

// Describe block for the SignUp page test suite
describe('SignUpForm', () => {
    // Test if the sign-up form includes name and email fields, and a submit button
    it('renders the sign-up form with name and email fields and a submit button', () => {
        render(
            <Router>
                <UserProvider>
                    <SignUp />
                </UserProvider>
            </Router>
        );
        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    // Test if it allows users to enter their name and email
    it('allows entering name and email', () => {
        render(
            <Router>
                <UserProvider>
                    <SignUp />
                </UserProvider>
            </Router>
        );
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
        expect(screen.getByPlaceholderText('Name').value).toBe('John Doe');
        expect(screen.getByPlaceholderText('Email').value).toBe('john@example.com');
    });
});
