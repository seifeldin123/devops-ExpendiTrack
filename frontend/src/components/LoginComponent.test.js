import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginComponent from './LoginComponent';
import { UserProvider } from '../contexts/UserContext';

describe('LoginComponent', () => {

    // Test if login inputs and button are rendered
    it('renders login inputs and button', () => {
        render(<LoginComponent />, { wrapper: UserProvider });
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    // Test if username and email inputs allow user input
    it('allows inputting username and email', () => {
        render(<LoginComponent />, { wrapper: UserProvider });
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@email.com' } });
        expect(screen.getByPlaceholderText('Username').value).toBe('testuser');
        expect(screen.getByPlaceholderText('Email').value).toBe('test@email.com');
    });
});
